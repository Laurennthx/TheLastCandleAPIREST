package es.urjc.grupo10.thelastcandle;

public class UserDTO {

    private String username;
    private String password;

    // Constructor que transforma un objeto User en UserDTO
    public UserDTO(User user) {
        this.username = user.getUsername();
        this.password = user.getPassword();
    }

    // Getters y setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
