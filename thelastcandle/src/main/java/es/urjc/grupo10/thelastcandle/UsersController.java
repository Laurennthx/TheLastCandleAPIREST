package es.urjc.grupo10.thelastcandle;

import java.util.Optional;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private ApiStatusService apiStatusService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    public UsersController(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        lock.writeLock().lock();
        try {
            boolean removed = this.userDAO.deleteUser(username);
            if (removed) {
                // Eliminarlo también de los usuarios conectados ya que no 
                // tiene sentido almacenar datos de un usuario que ha sido eliminado
                apiStatusService.removeUser(username);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } finally {
            lock.writeLock().unlock();
        }
    }

    // Todo esto teniendo las clases de User y UserDTO creadas en el proyecto
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        lock.readLock().lock();
        try {
            this.apiStatusService.hasSeen(username);
            Optional<User> user = this.userDAO.getUser(username);
            if (user.isPresent()) {
                return ResponseEntity.ok(new UserDTO(user.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } finally {
            lock.readLock().unlock();
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> postUsername(@RequestBody User user) {
        if (user.getUsername() == null || user.getPassword() == null || user.getPassword().trim().isEmpty()) { // Comprobar
                                                                                                               // que no
                                                                                                               // sea
                                                                                                               // nula o
                                                                                                               // vacía
            return ResponseEntity.badRequest().build();
        }

        lock.writeLock().lock();
        try {
            Optional<User> other = this.userDAO.getUser(user.getUsername());
            if (other.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            String trimmedPassword = user.getPassword().trim();
            String encodedPassword = passwordEncoder.encode(trimmedPassword);
            user.setPassword(encodedPassword);

            this.userDAO.updateUser(user);
            apiStatusService.hasSeen(user.getUsername()); // Registrar al usuario como conectado
            return ResponseEntity.noContent().build();
        } finally {
            lock.writeLock().unlock();
        }
    }

    @PutMapping("/{username}/password")
    public ResponseEntity<?> updatepassword(@PathVariable String username,
            @RequestBody PasswordUpdateRequest passwordUpdate) {
        if (passwordUpdate.password() == null || passwordUpdate.password().trim().isEmpty()) { // Comprobar que no sea
                                                                                               // nula o vacía
            return ResponseEntity.badRequest().build();
        }
        lock.writeLock().lock();
        try {
            Optional<User> optionalUser = this.userDAO.getUser(username);
            if (optionalUser.isPresent()) {
                var user = optionalUser.get();
                String encodedPassword = passwordEncoder.encode(passwordUpdate.password().trim());
                user.setPassword(encodedPassword);
                this.userDAO.updateUser(user);
                apiStatusService.hasSeen(user.getUsername()); // Registrar al usuario como conectado
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build(); // Usuario no encontrado
            }
        } finally {
            lock.writeLock().unlock();
        }
    }

    record PasswordUpdateRequest(String password) {
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        lock.readLock().lock();
        try {
            Optional<User> storedUser = this.userDAO.getUser(user.getUsername());
            if (storedUser.isPresent()) {
                boolean matches = passwordEncoder.matches(user.getPassword(), storedUser.get().getPassword());
                if (matches) {
                    apiStatusService.hasSeen(user.getUsername()); // Registrar al usuario como conetado
                    return ResponseEntity.ok("Inicio de sesión correcto");
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }
        } finally {
            lock.readLock().unlock();
        }
    }

    @PostMapping("/{username}/keepAlive")
    public ResponseEntity<?> keepAlive(@PathVariable String username) {
        Optional<User> optionalUser = userDAO.getUser(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
        apiStatusService.hasSeen(username); // Actualizar el timestamp del usuario
        return ResponseEntity.ok("Tiempo de usuario actualizado");
    }
}
