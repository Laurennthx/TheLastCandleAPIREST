package es.urjc.grupo10.thelastcandle;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    // HashMap para almacenar el chat del juego
    Map<Long, Chat> chatMap = new ConcurrentHashMap<>();
    AtomicLong nextId = new AtomicLong(0);
    private static final String FILE_NAME = "mensajes.txt";
    int nMessages = 20; // Número de mensajes a obtener en cada

    public ChatController() {
        loadMessagesFromFile();
    }

    // Método para cargar mensajes desde el fichero en el ConcurrentHashMap al
    // iniciar el juego
    private void loadMessagesFromFile() {
        try {
            File file = new File(FILE_NAME);
            if (file.exists()) {
                List<String> lines = Files.readAllLines(Paths.get(FILE_NAME));
                long maxId = 0;
                System.out.println("File found, reading players...");
                for (String line : lines) {
                    System.out.println("Processing line: " + line);
                    String[] parts = line.split(";", 3);
                    if (parts.length == 3) {
                        try {
                            long id = Long.parseLong(parts[0]);
                            String name = parts[1];
                            String message = parts[2];
                            chatMap.put(id, new Chat(id, name, message));
                            System.out.println("Chat loaded: ID=" + id + ", Name=" + name + ", Mensaje=" + message);
                            if (id > maxId) {
                                maxId = id;
                            }
                        } catch (NumberFormatException e) {
                            System.err.println("Invalid number format in line: " + line);
                        }
                    }
                }
                nextId.set(maxId);
            } else {
                Files.createFile(Paths.get(FILE_NAME));

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Método para guardar los mensajes en el fichero
    private void saveMessagesToFile() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_NAME))) {
            for (Chat chat : chatMap.values()) {
                writer.write(chat.getId() + ";" + chat.getUsername() + ";" + chat.getMessage());
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/")
    public List<Chat> getMessages() { 
        int size = chatMap.size();
        // Ya que están ordenados por id no hace falta consultar su id para filtrarlos
        return chatMap.values().stream().skip(Math.max(0, size - nMessages)).toList();
    }

    // Petición POST para añadir nuevo mensaaje
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Chat addMessage(@RequestBody Chat nuevoMensaje) {
        long id;
        if (chatMap.isEmpty()) {
            id = 0;
            nextId.set(id);
        } else {
            id = nextId.incrementAndGet();
        }
        nuevoMensaje.setID(id);
        chatMap.put(nuevoMensaje.getId(), nuevoMensaje);
        saveMessagesToFile();
        return nuevoMensaje;
    }
}
