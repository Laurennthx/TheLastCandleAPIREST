package es.urjc.grupo10.thelastcandle;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;

/**
 * WebSocket handler for a real-time multiplayer game
 */
@Component
public class GameWebSocketHandler extends TextWebSocketHandler {
    // Colecciones
    private final Map<String, Player> players = new ConcurrentHashMap<>();
    private final Map<String, Game> games = new ConcurrentHashMap<>();
    private final Queue<WebSocketSession> waitingPlayers = new ConcurrentLinkedQueue<>();
    private final ObjectMapper mapper = new ObjectMapper();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    /**
     * Represents a player in the game with their position, score, and WebSocket
     * session.
     */
    private static class Player {
        WebSocketSession session;
        double x;
        double y;
        int playerId;

        Player(WebSocketSession session) {
            this.session = session;
        }
    }

    /**
     * Represents an active game between two players.
     * Includes game state like the current square, time remaining, and scheduled
     * tasks.
     */
    private static class Game {
        int ready; // Jugadores seleccionan personaje

        Player player1;
        Player player2;

        List<Candle> candles; // Velas de la partida
        int nCandles;
        List<Integer> rituals; // Velas de la partida
        Crucifix crucifix;

        int timeForCrucifix = 10; // Tiempo para que salga el crucifijo
        ScheduledFuture<?> timerTask;

        Game(Player player1, Player player2) {
            this.ready = 0;
            this.player1 = player1;
            this.player2 = player2;
            this.nCandles = 5;
            this.rituals = new ArrayList<>(Arrays.asList(0, 0, 0));
        }
    }

    private final List<Room> rooms = new ArrayList<>();
    private final Random random = new Random();
    private double escalaBg = (double) 1080 / 15522;
    private double anchuraVela = 865 * 0.013 / escalaBg;
    private double alturaVela = 1449 * 0.013 / escalaBg;
    private double anchuraCrucifix = 547 * 0.5;
    private double alturaCrucifix = 721 * 0.5;

    private static class Room {
        double x, y, width, height;

        public Room(double x, double y, double width, double height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }

    private static class Candle {
        int id;
        double x, y;

        public Candle(int id, double x, double y) {
            this.id = id;
            this.x = x;
            this.y = y;
        }
    }

    private static class Crucifix {
        double x, y;
        boolean picked;

        public Crucifix(double x, double y) {
            this.x = x;
            this.y = y;
            this.picked = false;
        }
    }

    /**
     * Handles new WebSocket connections by creating a player and adding them to the
     * waiting queue.
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Sequential access/write for waitingPlayers
        waitingPlayers.add(session);
        players.put(session.getId(), new Player(session));

        synchronized (this) {
            // Ensure that create game is thread-safe
            checkAndCreateGame();
        }
    }

    // #region COMENZAR

    // 1º Sala de espera
    // 2º Se hace un checkAndCreateGame() para detectar que hay dos jugadores.
    // y así comenzar la selección de personajes.
    // 3º Los jugadores indican que están listos y envían un mensaje al servidor.
    // 4º El servidor los recive y comienza la pantalla de loading.
    // 5º Entran en la escena de GameOnline y se pausa (sigue el mensaje de
    // loading).
    // 6º Envían otro mensaje para indicar que ya han cargado todo
    // 7º El servidor envía la información de inicio y comienza el juego

    /**
     * Attempts to create a new game if there are at least 2 players waiting.
     * Sets up initial player positions and starts the game.
     */
    private synchronized void checkAndCreateGame() {
        if (waitingPlayers.size() >= 2) {
            WebSocketSession session1 = waitingPlayers.poll();
            WebSocketSession session2 = waitingPlayers.poll();

            if (session1 != null && session2 != null) {

                Player player1 = players.get(session1.getId());
                Player player2 = players.get(session2.getId());

                // Initialize player positions and IDs
                player1.playerId = 1;
                player2.playerId = 2;
                player1.x = 100; // Left side of screen
                player1.y = 300; // Middle height
                player2.x = 700; // Right side of screen
                player2.y = 300; // Middle height

                Game game = new Game(player1, player2);
                games.put(session1.getId(), game);
                games.put(session2.getId(), game);

                gameInit(game);
            }
        }
    }

    /**
     * Initializes a new game by sending initial states to players and starting the
     * game loop.
     * Message format 'i': Initial game state with player positions and candles
     * Message format 'p': Ids and positions of the candles to generate
     */
    private void gameInit(Game game) {

        // Generar las velas y enviarlas
        game.candles = generateCandles(game.nCandles);
        List<List<Object>> candlePositions = new ArrayList<>();
        for (Candle candle : game.candles) {
            candlePositions.add(Arrays.asList(candle.id, candle.x, candle.y));
        }

        // Send the positions of the candles to both players.
        sendToPlayer(game.player1, "c", candlePositions);
        sendToPlayer(game.player2, "c", candlePositions);

        // Create initial player data: [x, y, playerId]
        List<List<Object>> playersData = Arrays.asList(
                Arrays.asList(game.player1.x, game.player1.y, 1), // Player 1: Exorcist
                Arrays.asList(game.player2.x, game.player2.y, 2) // Player 2: Demon
        );

        // Send initial state to both players.
        sendToPlayer(game.player1, "i", Map.of("id", 1, "p", playersData));
        sendToPlayer(game.player2, "i", Map.of("id", 2, "p", playersData));

        // Generar el crucifijo
        game.crucifix = generateCrucifix();
        sendToPlayer(game.player1, "g", Arrays.asList(game.crucifix.x, game.crucifix.y));
        sendToPlayer(game.player2, "g", Arrays.asList(game.crucifix.x, game.crucifix.y));

    }

    // #endregion

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {

            Game game = games.get(session.getId());

            if (game == null)
                return;

            Player currentPlayer = players.get(session.getId());
            Player otherPlayer = game.player1 == currentPlayer ? game.player2 : game.player1;

            String payload = message.getPayload();

            char type = payload.charAt(0);
            String data = payload.length() > 1 ? payload.substring(1) : "";

            switch (type) {
                case 'p': // Position update. De cliente a servidor es la posición en X e Y
                    List<Integer> pos = mapper.readValue(data, List.class);
                    currentPlayer.x = pos.get(0);
                    currentPlayer.y = pos.get(1);
                    // Enviar la información al otro jugador
                    sendToPlayer(otherPlayer, "p",
                            Arrays.asList(currentPlayer.playerId, currentPlayer.x, currentPlayer.y));
                    break;
                case 'v': // Recolección de velas. Actualizar la vela recogida y la puntuación
                    Integer candleRemoved = mapper.readValue(data, Integer.class);
                    if (game.candles.get(candleRemoved - 1).id != -1) { // NOTA: es necesario este if?
                        game.candles.get(candleRemoved - 1).id = -1;
                        sendToPlayer(currentPlayer, "v", candleRemoved);
                        sendToPlayer(otherPlayer, "v", candleRemoved);
                    }
                    break;
                case 'l': // Colocar vela en ritual
                    Integer ritualRemoved = mapper.readValue(data, Integer.class);
                    if (game.rituals.get(ritualRemoved - 1) != -1) { // Si no tienen el valor -1 es que todavía no han
                                                                     // sido usados
                        game.rituals.set(ritualRemoved - 1, -1);
                        sendToPlayer(currentPlayer, "l", ritualRemoved);
                        sendToPlayer(otherPlayer, "l", ritualRemoved);
                    }
                case 'x': // Obtener crucifijo
                    if (game.crucifix.picked == false) {
                        game.crucifix.picked = true;
                        sendToPlayer(currentPlayer, "x", null);
                        sendToPlayer(otherPlayer, "x", null);
                    }
                    break;
                case 'r': // Un jugador está ready para EMPEZAR la partida
                    if (++game.ready == 2) {
                        // Comenzar el timer del crucifijo

                        sendToPlayer(currentPlayer, "r", null);
                        sendToPlayer(otherPlayer, "r", null);
                    }
                    break;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Sends a message to a specific player with the given type and data.
     * Messages are formatted as: type + JSON data
     * 
     * @param player The target player
     * @param type   Single character message type
     * @param data   Data to be JSON serialized (can be null)
     */
    private void sendToPlayer(Player player, String type, Object data) {
        try {
            String message = type;
            if (data != null) {
                message += mapper.writeValueAsString(data);
            }
            synchronized (player.session) {
                player.session.sendMessage(new TextMessage(message));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Ends the game by sending winning player and cleaning up game resources.
     * Message format 'o': Game over with the id of the winning player
     */
    private void endGame(Game game) {
        // NOTA: cambiar esto
        // // Send final scores to both players
        // List<Integer> finalScores = Arrays.asList(game.player1.score,
        // game.player2.score);

        // if (this.players.containsKey(game.player1.session.getId())) {
        // sendToPlayer(game.player1, "o", finalScores);
        // }

        // if (this.players.containsKey(game.player2.session.getId())) {
        // sendToPlayer(game.player2, "o", finalScores);
        // }

        games.remove(game.player1.session.getId());
        games.remove(game.player2.session.getId());
    }

    /**
     * Handles WebSocket connection closures by cleaning up player and game
     * resources.
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        players.remove(session.getId());
        waitingPlayers.remove(session);

        Game game = games.remove(session.getId());
        if (game != null) {
            endGame(game);
        }

    }

    // #region VELAS

    // Crear las habitaciones
    {
        rooms.add(new Room(1001.5, 3870, 1495, 2390)); // bedroom1
        rooms.add(new Room(2934, 2545.5, 2130, 1471)); // bedroom2
        rooms.add(new Room(7056, 2539, 2566, 1496)); // bedroom3
        rooms.add(new Room(2512, 12016.5, 2124, 1205)); // bathroom2
        rooms.add(new Room(5341.5, 7329.5, 2723, 2693)); // kitchen
        rooms.add(new Room(5704, 11096.5, 4048, 2977)); // livingRoom
        rooms.add(new Room(1968.5, 10037, 3455, 872)); // hall
        rooms.add(new Room(3229 + 2895 / 2, 4195 + 878 / 2, 2895, 878)); // corridor1
        rooms.add(new Room(6884 + 868 / 2, 5080 + 4538 / 2, 868, 4538)); // corridor2
        rooms.add(new Room(3700 + 4046 / 2, 13520 + 1500 / 2, 4046, 1500)); // hall2
    }

    /**
     * Genera las velas en posiciones aleatorias.
     * Devuelve una lista de velas.
     * 
     * @param {count} - Número de velas a generar.
     */
    public List<Candle> generateCandles(int count) {
        double minDistance = 2500;
        List<double[]> positions = new ArrayList<>();
        List<Candle> candles = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            double x = 0, y = 0;
            boolean validPosition = false;
            double minDistanceTemp = minDistance;
            int nIterations = 0;

            while (!validPosition) {
                if (nIterations++ == rooms.size()) {
                    minDistanceTemp = 0;
                }
                // Escoger una habitación al azar
                Room randomRoom = rooms.get(random.nextInt(rooms.size()));
                int nAttempts = 10;

                for (int j = 0; j < nAttempts; j++) {
                    validPosition = true;

                    x = randomRoom.x + random.nextDouble() * (randomRoom.width - 2 * anchuraVela)
                            - randomRoom.width / 2 + anchuraVela;
                    y = randomRoom.y + random.nextDouble() * (randomRoom.height - 2 * alturaVela)
                            - randomRoom.height / 2 + alturaVela;

                    for (double[] pos : positions) {
                        double distance = Math.sqrt(Math.pow(x - pos[0], 2) + Math.pow(y - pos[1], 2));
                        if (distance < minDistanceTemp) {
                            validPosition = false;
                            break;
                        }
                    }

                    if (validPosition) {
                        break;
                    }
                }
            }
            positions.add(new double[] { x, y });
            candles.add(new Candle(i + 1, x * escalaBg, y * escalaBg));
        }
        return candles;
    }

    /**
     * Genera el crucifijo en posición aleatoria.
     * Devuelve un crucifijo.
     */
    // Método para generar el crucifijo
    public Crucifix generateCrucifix() {
        // Selección aleatoria de habitación
        Room randomRoom = rooms.get(random.nextInt(rooms.size()));

        // Generar una posición aleatoria dentro de la habitación
        double x = randomRoom.x + random.nextDouble() * (randomRoom.width - anchuraCrucifix) - randomRoom.width / 2
                + anchuraCrucifix / 2;
        double y = randomRoom.y + random.nextDouble() * (randomRoom.height - alturaCrucifix) - randomRoom.height / 2
                + alturaCrucifix / 2;

        // Crear el crucifijo con las coordenadas generadas
        Crucifix crucifix = new Crucifix(x, y);
        return crucifix;
    }

}
