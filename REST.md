# The Last Candle: Fase 3 - API REST

## Funcionalidades implementadas con API REST

La creación de una cuenta nueva se realiza al registar un nuevo usuario con su contraseña y comprobar si el nombre de usuario no existe, si ya existe, saldrá un mensaje de error con "El usuario ya existe.". A la hora de crearlo saldrá un mensaje "cargando..." y se realizará un @POST para crearlo.

Para el inicio de sesión se comprueba que ya exista el usuario, si no es asi, saldrá un mensaje de error con "Usuario no encontrado.". Si se introducen bien las credenciales se entra en su cuenta. Esto supone hacer @GET de ese nombre de usuario.

Tanto como en el registro como en el inicio de sesion saldrian mensajes por el error 401 ("Credenciales incorrectas.").

Al actualizar el nombre de usuario se comprueba si el nuevo nombre ya existe, y si es que no, se actualiza correctamente. Esto supone relizar un @UPDATE de ese nombre de usuario.

Para eliminar una cuenta solo se puede hacer desde la propia cuenta pulsando el boton de "Delete Account" dentro de las opciones, al hacerlo se elimina de la lista correctamente. Esto supone realizar un @DELETE de ese nombre de usuario, y por tanto de la cuenta.
