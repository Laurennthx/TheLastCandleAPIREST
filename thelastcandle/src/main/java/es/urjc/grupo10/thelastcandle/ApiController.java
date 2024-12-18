package es.urjc.grupo10.thelastcandle;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ApiStatusService apiStatusService;

    public ApiController(ApiStatusService apiStatusService) {
        this.apiStatusService = apiStatusService;
    }

    // Endpoint para obtener los usuarios conectados
    @GetMapping("/connected-users")
    public List<String> getConnectedUsers() {
        long threshold = 300000; // Usuarios activos en los últimos 5 minutos
        return apiStatusService.isConnected(threshold);
    }
}