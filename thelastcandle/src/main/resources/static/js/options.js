class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });

    }

    preload() {
        this.load.audio("introMusic", 'assets/Music/sinister.mp3');

        this.load.image("OptionsBG", "assets/UI/ajustes/fondo.png");

        this.load.image("on_music", "assets/UI/ON.png");
        this.load.image("off_music", "assets/UI/OFF.png");

        this.load.image("backButton", "assets/UI/return.png");

        // nuevos ajustes
        this.load.image("BGInput", "assets/UI/ajustes/BGInput.png");
        this.load.image("ChangeB", "assets/UI/ajustes/ChangeB.png");
        this.load.image("ChangeB", "assets/UI/ajustes/ChangeB.png");
        this.load.image("deleteAccountB", "assets/UI/ajustes/deleteAccountB.png");


    }

    create() {

        // imagen de fondo
        const OptionsBG = this.add.image(0, 0, "OptionsBG").setOrigin(0, 0);
        OptionsBG.setDisplaySize(1920, 1080);

        // boton music on
        // si la musica ya está encendida nos aseguramos que no se instancia una nueva
        const on_music = this.add.image(325, 760, "on_music")
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("select");
                // Verifica si la música ya está inicializada y reproduciéndose
                if (!this.bgMusic || !this.bgMusic.isPlaying) {
                    this.bgMusic = this.sound.add('introMusic');
                    this.bgMusic.loop = true;
                    this.bgMusic.play();
                }
            })
            .on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        on_music.setScale(0.5, 0.5);

        // boton music off
        const off_music = this.add.image(325, 880, "off_music")
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("select");
                this.bgMusic.stop();
            })
            .on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        off_music.setScale(0.5, 0.5);



        // Cambiar contraseña 

        const passwordField = this.createInputField(950, 760, 'Password', true);

        // Crear un cuadro de texto para mostrar errores
        this.errorText = this.add.text(960, 500, '', {
            font: '24px Arial',
            fill: '#ff0000',
            fontFamily: 'Arial',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5, 0.5).setAlpha(0); // Inicialmente invisible


        // boton cambiar contraseña
        const changeB = this.add.image(950, 880, "ChangeB")
            .setInteractive()
            .on('pointerdown', () => {
                const password = passwordField.getData('value');
                this.sound.play("select");
                console.log("Changing password...");
                this.handleChangePassword(window.GameData.currentUser, password);
            }).on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        changeB.setScale(0.5);


        // delete account
        const deleteAccountB = this.add.image(1600, 750, "deleteAccountB")
            .setInteractive()
            .on('pointerdown', () => {
                this.handleDeleteAccount(window.GameData.currentUser)
            })
            .on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        deleteAccountB.setScale(0.5);


        // boton back
        const returnButton = this.add.image(175, 90, "backButton")
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("select");
                this.scene.stop("OptionsScene");
                this.scene.start("MenuScene");
            })
            .on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        returnButton.setScale(0.4, 0.4);


        // Activar entrada de teclado
        this.input.keyboard.on('keydown', (event) => {
            this.handleKeyboardInput(event, passwordField);
        });

        // Variable para rastrear el campo de entrada actualmente activo
        this.currentField = null;

    }

    // Método para mostrar los errores en el cuadro de texto y hacer que desaparezca después de unos segundos
    showError(message, x, y, color) {
        if (!color) color = '#ff0000'
        this.errorText.setText(message);
        this.errorText.setPosition(x, y);
        this.errorText.setStyle({ fill: color });
        this.errorText.setAlpha(1); // Mostrar el mensaje

        // Hacer que el mensaje desaparezca después de 3 segundos (3000 milisegundos)
        this.time.delayedCall(3000, () => {
            this.errorText.setAlpha(0);  // Desaparecer el mensaje
        }, [], this);
    }

    createInputField(x, y, placeholder, isPassword = false) {
        const inputBG = this.add.image(x, y, 'BGInput').setOrigin(0.5, 0.5).setScale(0.5);

        // Texto interactivo como "campo de entrada"
        const inputText = this.add.text(x, y, placeholder, {
            font: '24px Arial',
            color: '#000',
            backgroundColor: 'rgba(255, 255, 255, 0)',
        })
            .setOrigin(0.5, 0.5)
            .setPadding(10, 5)
            .setInteractive()
            .on('pointerdown', () => {
                this.currentField = inputText; // Hacer este campo activo
                if (inputText.getData('value') === undefined) {
                    inputText.setData('value', ''); // Inicializar valor
                }
                if (inputText.text === placeholder) {
                    inputText.setText(''); // Borrar placeholder
                }
            });

        inputText.setData('value', ''); // Inicializar valor vacío
        inputText.setData('isPassword', isPassword); // Indicar si es contraseña
        return inputText;
    }

    handleKeyboardInput(event, passwordField) {
        if (this.currentField) {
            const value = this.currentField.getData('value');
            const isPassword = this.currentField.getData('isPassword');

            if (event.key === 'Backspace') {
                // Eliminar el último carácter
                const newValue = value.slice(0, -1);
                this.currentField.setData('value', newValue);
                this.currentField.setText(isPassword ? '*'.repeat(newValue.length) : newValue);
            } else if (event.key.length === 1) {
                // Añadir carácter
                const newValue = value + event.key;
                this.currentField.setData('value', newValue);
                this.currentField.setText(isPassword ? '*'.repeat(newValue.length) : newValue);
            }
        }
    }

    handleChangePassword(username, password) {
        var posx = 950
        var posy = 970
        if (!username) {
            console.error("User not found.");
            this.showError("User not found.", posx, posy);
            return;
        }
        if (!password) {
            console.error("Please, fill in all the fields.");
            this.showError("Please, fill in all the fields.", posx, posy);
            return;
        }
        else {
            this.errorText.setText("Loading...");
            this.errorText.setPosition(posx, posy);
            this.errorText.setStyle({ fill: '#000000' });
            this.errorText.setAlpha(1); // Mostrar el mensaje
        }

        console.log(window.GameData.currentUser)
        $.ajax({
            url: "/api/users/" + username + "/password",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                password: password
            }),
            success: () => {
                console.log("Password updated successfully.");
                this.showError("Password updated successfully.", posx, posy, '#000000'); // Mensaje en verde
            },
            error: (xhr) => {
                if (xhr.status === 404) {
                    console.error("User not found.");
                    this.showError("User not found.", posx, posy);
                } else if (xhr.status === 400) {
                    console.error("The password cannot be empty.");
                    this.showError("The password cannot be empty.", posx, posy);
                } else {
                    console.error("Error changing the password:", xhr.responseText);
                    this.showError("Error changing the password.", posx, posy);
                }
            }
        });
    }

    handleDeleteAccount(username, password) {
        var posx = 1600
        var posy = 840
        if (!username) {
            console.error("User not found.");
            this.showError("User not found.", posx, posy);
            return;
        }

        // Mostrar un mensaje de confirmación antes de eliminar el usuario
        if (!confirm("Are you sure you want to delete your user? This action cannot be undone.")) {
            return;
        }

        this.errorText.setText("Loading...");
        this.errorText.setPosition(posx, posy);
        this.errorText.setStyle({ fill: '#000000' });
        this.errorText.setAlpha(1); // Mostrar el mensaje


        $.ajax({
            url: "/api/users/" + username,
            method: "DELETE",
            success: () => {
                console.log("User deleted successfully.");
                this.showError("User deleted successfully.", posx, posy, '#000000'); // Mensaje en verde

                // Redirigir a otra escena o realizar una acción
                setTimeout(() => {
                    this.scene.stop("OptionsScene");
                    this.scene.start("WelcomeScene");
                }, 1500);
            },
            error: (xhr) => {
                if (xhr.status === 404) {
                    console.error("User not found.");
                    this.showError("User not found.", posx, posy);
                } else {
                    console.error("Error deleting the user:", xhr.responseText);
                    this.showError("Error deleting the user.", posx, posy);
                }
            }
        });
    }

}
