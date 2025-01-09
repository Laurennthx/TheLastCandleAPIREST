package es.urjc.grupo10.thelastcandle;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class ApiStatusService {
    // nombre de usuario y el timestamp de su última interacción
    private final ConcurrentHashMap<String, Long> lastSeen;

    public ApiStatusService() {
        this.lastSeen = new ConcurrentHashMap<>();
    }

    public void hasSeen(String username) {
        this.lastSeen.put(username, System.currentTimeMillis());
    }

    public List<String> isConnected(long threshold) {
        List<String> connected = new ArrayList<>();
        for (var entry : this.lastSeen.entrySet()) {
            if (entry.getValue() > (System.currentTimeMillis() - threshold)) {
                connected.add(entry.getKey());
            }
        }
        return connected;
    }

    public int numberOfUsersConnected(long treshold) {
        return this.isConnected(treshold).size();
    }

    // Eliminar un usuario del hashmap
    public void removeUser(String username) {
        this.lastSeen.remove(username);
    }
}
