package es.urjc.grupo10.thelastcandle;

import java.io.Serializable;

public class User implements Serializable {
    // To ensure serialization
    private static final long serialVersionUID = 1L;

    String username;
    String password;
    int victories;

    public User() {
    }

    public User(String name, String password) {
        this.username = name;
        this.password = password;
        victories = 0;
    }

    public String getUsername() {
        return username;
    }

    public void setName(String newName) {
        username = newName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getVictories() {
        return victories;
    }

    public void hasWon() {
        victories += 1;
    }

    @Override
    public String toString() {
        return "USER : Name: " + username + ", Password:" + password;
    }
}
