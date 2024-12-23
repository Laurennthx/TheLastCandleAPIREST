package es.urjc.grupo10.thelastcandle;
public class Chat {

    private int id;
    private String username;
    private String message;

public Chat(int id, String nombre, String message){
    this.id = id;
    this.username= nombre;
    this.message= message;

}

public int getId(){
return id;
}
public void setID(int id){
    this.id=id;
}

public String getUsername(){
return username;
}
public void setUsername(String nombre){
    this.username= nombre;

}

public String getMessage(){
    return message;
    }
public void setMessage(String message){
    this.message= message;
}


    @Override
    public String toString() {
        return "message [id=" + id + ", NombreUsuario=" + username + ", message=" + message + "]";
    }

}