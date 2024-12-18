# The Last Candle: Fase 3 - API REST

## Funcionalidades implementadas con API REST

La creación de una cuenta nueva se realiza al registar un nuevo usuario con su contraseña y comprobar si el nombre de usuario no existe, si ya existe, saldrá un mensaje de error con "El usuario ya existe.". A la hora de crearlo saldrá un mensaje "cargando..." y se realizará un @POST para crearlo. Además, al crear un usuario su contraseña es codificada.

# POST http://localhost:8080/api/users/
# Content-Type: application/json

# {
#   "username": "nombre",
#   "password": "123"
# }

# POST http://localhost:8080/api/users/
# Content-Type: application/json

# {
#   "username": "nombre",
#   "password": "      "    // Daría error al tener una contraseña vacía
# }

Para el inicio de sesión se comprueba que ya exista el usuario, si no es asi, saldrá un mensaje de error con "Usuario no encontrado.". Si se introducen bien las credenciales se entra en su cuenta. Esto supone hacer @POST de ese nombre de usuario y contraseña. Se hace un POST
porque así los datos se envían en el cuerpo de la solicitud HTTP y no son visibles en la URL.

# POST http://localhost:8080/api/users/login
# Content-Type: application/json

# {
#   "username": "nombre",
#   "password": "123"
# }

Tanto como en el registro como en el inicio de sesion saldrian mensajes por el error 401 ("Credenciales incorrectas.").

Para actualizar la contraseña del usuario, se introduce una nueva contraseña desde el menú de opciones y se comprueba si es válida. Esto supone relizar un @PUT de una nueva contraseña en el usuario con el que se inició sesión.

# PUT http://localhost:8080/api/users/nombre/password  //Siendo "nombre" el nombre del usuario
# Content-Type: application/json

# {
#   "password": "321"
# }

Para eliminar una cuenta solo se puede hacer desde la propia cuenta pulsando el boton de "Delete Account" dentro de las opciones, al hacerlo se elimina el usuario correctamente. Esto supone realizar un @DELETE de ese nombre de usuario, y por tanto de la cuenta.

# DELETE http://localhost:8080/api/users/nombre
