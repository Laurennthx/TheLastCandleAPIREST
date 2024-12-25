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
        Player player1;
        Player player2;
        List<Object> candlesAvailable; // Información de las velas: posición y si ha sido obtenida o no
        int score;
        int timeForCrucifix = 10; // Tiempo para que salga el crucifijo
        ScheduledFuture<?> timerTask;

        Game(Player player1, Player player2) {
            this.player1 = player1;
            this.player2 = player2;
            this.score = 0;
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
            }
        }
    }

    /**
     * Initializes a new game by sending initial states to players and starting the
     * game loop.
     * Message format 'i': Initial game state with player positions and candles
     */
    private void startGame(Game game) {
        // Create initial player data: [x, y, playerId]
        List<List<Object>> playersData = Arrays.asList(
                Arrays.asList(game.player1.x, game.player1.y, 1), // Player 1: Exorcist
                Arrays.asList(game.player2.x, game.player2.y, 2) // Player 2: Demon
        );

        // Generar las velas y enviarlas

        // Send initial state to both players.
        sendToPlayer(game.player1, "i", Map.of("id", 1, "p", playersData));
        sendToPlayer(game.player2, "i", Map.of("id", 2, "p", playersData));

        // Comenzar el timer del crucifijo

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
                    if (game.candlesAvailable.get(candleRemoved) != null) { // NOTA: es necesario este if?
                        List<Integer> scoreData = Arrays.asList(candleRemoved, ++game.score);
                        sendToPlayer(otherPlayer, "v", scoreData);
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
        // Send final scores to both players
        List<Integer> finalScores = Arrays.asList(game.player1.score, game.player2.score);

        if (this.players.containsKey(game.player1.session.getId())) {
            sendToPlayer(game.player1, "o", finalScores);
        }

        if (this.players.containsKey(game.player2.session.getId())) {
            sendToPlayer(game.player2, "o", finalScores);
        }

        // Cancel timer and cleanup game resources
        if (game.timerTask != null) {
            game.timerTask.cancel(false);
        }

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
}
