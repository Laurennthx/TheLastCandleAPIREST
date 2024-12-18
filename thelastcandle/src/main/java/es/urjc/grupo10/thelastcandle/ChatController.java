package es.urjc.grupo10.thelastcandle;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    private final List<ChatMessage> messages = new ArrayList<>();
    private final AtomicInteger lastId = new AtomicInteger(0);


    @GetMapping()
    public ChatResponse getMessages(@RequestParam(defaultValue = "0") int since) {
        List<String> newMessages = new ArrayList<>();
        int latestId = since;

        synchronized (messages) {
            for (ChatMessage msg : messages) {
                if (msg.getId() > since) {
                    newMessages.add(msg.getText());
                    latestId = msg.getId();
                }
            }
        }

        return new ChatResponse(newMessages, latestId);
    }

    @PostMapping
    public void postMessage(@RequestParam String message) {
        synchronized (messages) {
            messages.add(new ChatMessage(lastId.incrementAndGet(), message));
            if (messages.size() > 50) {
                messages.remove(0); // Keep only the last 50 messages
            }
        }
    }

    public static class ChatResponse {
        private final List<String> messages;
        private final int timestamp;

        public ChatResponse(List<String> messages, int timestamp) {
            this.messages = messages;
            this.timestamp = timestamp;
        }

        public List<String> getMessages() {
            return messages;
        }

        public int getTimestamp() {
            return timestamp;
        }
    }
}
