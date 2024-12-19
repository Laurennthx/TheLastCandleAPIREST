package es.urjc.grupo10.thelastcandle;

import org.springframework.lang.NonNull;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class WebsocketDemoHandler extends TextWebSocketHandler {

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
        System.out.println("Message received: " + message.getPayload());
        
        String msg = message.getPayload();
        session.sendMessage(new TextMessage(msg));
    }
}
