package es.urjc.grupo10.thelastcandle;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
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
    public List<String> getConnectedUsers(@RequestHeader("Username") String username) {
        // Registrar al usuario que realiza la solicitud
        apiStatusService.hasSeen(username);
        long threshold = 15000; // Usuarios activos en los últimos 15segundos
        return apiStatusService.isConnected(threshold);
    }
    //Endpoint para el checkeo de la conexion con el servidor
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("OK");
    }
}