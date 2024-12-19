package es.urjc.grupo10.thelastcandle;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.lang.NonNull;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class ChatHandler extends TextWebSocketHandler {

    private static final int MAX_SESSIONS = 2;
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper mapper = new ObjectMapper();
    
    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
        if (sessions.size() < MAX_SESSIONS) {
            System.out.println("New user: " + session.getId());
            sessions.put(session.getId(), session);
        } else {
            System.out.println("Connection refused: " + session.getId());
            session.close(CloseStatus.SERVICE_OVERLOAD); // Custom close status for service overload
        }
    }
	
    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
        System.out.println("Session closed: " + session.getId());
        sessions.remove(session.getId());
    }
	
    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
        System.out.println("Message received: " + message.getPayload());
        JsonNode node = mapper.readTree(message.getPayload());
        sendOtherParticipants(session, node);
    }

    private void sendOtherParticipants(@NonNull WebSocketSession session, @NonNull JsonNode node) throws IOException {
        System.out.println("Message sent: " + node.toString());
        ObjectNode newNode = mapper.createObjectNode();
        newNode.put("type", node.get("type").asText());
        for (WebSocketSession participant : sessions.values()) {
            if (!participant.getId().equals(session.getId())) {
                participant.sendMessage(new TextMessage(newNode.toString()));
            }
        }
    }
}
