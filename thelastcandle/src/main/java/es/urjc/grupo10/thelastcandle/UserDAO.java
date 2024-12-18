package es.urjc.grupo10.thelastcandle;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class UserDAO {
    // Note: This is a very very simplified version of a DAO.
    // DAOs should be interfaces implemented by concrete repository implementations
    // Also, in spring we should use Hibernate or similar which simplifies
    // the mapping between instances and the repositories.

    @Autowired
    @Qualifier("usersPath")
    private String usersPath;

    public UserDAO(String usersPath) {
        this.usersPath = usersPath;
    }

    @Autowired
    private ObjectMapper objectMapper;

    public List<User> getAllUsers() throws IOException {
        var objectMapper = new ObjectMapper();

        Path path = Paths.get(usersPath);

        try {
            // Use Stream API to map files directly to User objects and collect them into a
            // list
            return Files.list(path) // List all files in the directory
                    .filter(Files::isRegularFile) // Ensure that only files are processed
                    .filter(file -> file.toString().endsWith(".json")) // Only consider .json files
                    .map(file -> {
                        try {
                            // Read the content of the JSON file and convert it to a User object
                            return objectMapper.readValue(file.toFile(), User.class);
                        } catch (IOException e) {
                            e.printStackTrace(); // Handle the error appropriately
                            return null; // Return null in case of an error (could be handled differently)
                        }
                    })
                    .filter(user -> user != null) // Filter out any null values in case of errors
                    .collect(Collectors.toList()); // Collect the results into a List
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public Optional<User> getUser(String username) {
        try {
            // Construct the file path dynamically based on the username
            String filePath = this.usersPath + "/" + username + ".json";
            File file = new File(filePath);
            return Optional.of(objectMapper.readValue(file, User.class));
        } catch (IOException ex) {
            return Optional.empty();
        }
    }

    // Method to update the User in the JSON file
    public boolean updateUser(User updatedUser) {
        try {
            // Construct the file path dynamically based on the username
            String filePath = this.usersPath + "/" + updatedUser.getUsername() + ".json";
            File file = new File(filePath);

            // Write the updated User object back to the file
            objectMapper.writeValue(file, updatedUser);
            return true; // Successfully updated the file
        } catch (IOException e) {
            e.printStackTrace();
            return false; // Error occurred while updating the file
        }
    }

    // Method to delete the User from the JSON file
    public boolean deleteUser(String username) {
        try {
            // Construct the file path dynamically based on the username
            String filePath = this.usersPath + "/" + username + ".json";
            File file = new File(filePath);

            if (!file.exists()) {
                return false; // File does not exist, return false
            }

            // Delete the file (or overwrite it with empty content if you prefer)
            boolean isDeleted = file.delete(); // Deleting the file
            return isDeleted;
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Error occurred while deleting the file
        }
    }
}