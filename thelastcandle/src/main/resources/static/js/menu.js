class MenuScene extends Phaser.Scene {
    constructor(){
        super({key: 'MenuScene'});
        this.userList = "";
    }

    preload(){
        this.load.image("menuBG", 'assets/UI/BGpersonajes.jpg');
        this.load.image("bStart", 'assets/UI/start.png');
        this.load.image("bOptions", 'assets/UI/options.png');
        this.load.image("bCredits", 'assets/UI/credits.png');
        this.load.image("bQuit", 'assets/UI/quit.png');
        this.load.image("CreditsBG", 'assets/UI/creditos.jpg');

        this.load.image("chatB", 'assets/UI/chat/chatB.png');
        this.load.image("chatBG", 'assets/UI/chat/chatBG.png');
        this.load.image("chatFade", 'assets/UI/chat/chatFade.png');
        this.load.image("onlineBG", 'assets/UI/chat/online.png');
    }


    create(){

        // Estado inicial del chat desactivado
        this.isChatActive = false;

        // inmagen de fondo
        const backgroundMenu = this.add.image(0,0, "menuBG").setOrigin(0,0);
        backgroundMenu.setDisplaySize(1920, 1080);

        // boton start
        const start_button = this.add.image(350, 450, "bStart")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("MenuScene");
            this.scene.start("GameModeScene");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        start_button.setScale(0.5,0.5);


        // boton options
        const options_button = this.add.image(350, 570, "bOptions")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("MenuScene");
            this.scene.start("OptionsScene");   
        });  
        options_button.setScale(0.5,0.5);

        // boton credits
        const credits_button = this.add.image(350, 690, "bCredits")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            // actualizar las escenas más tarde
            this.scene.stop("MenuScene");
            this.scene.start("CreditsScene");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        credits_button.setScale(0.5,0.5);

        // boton quit
        const quit_button = this.add.image(350, 810, "bQuit")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("MenuScene");
            this.scene.start("WelcomeScene");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        quit_button.setScale(0.5,0.5);


    

        // #region chat

        // Elementos del chat
        const chatFade = this.add.image(960, 540, "chatFade").setVisible(false).setScale(1);
        const BGChat = this.add.image(1480, 540, "chatBG").setVisible(false).setScale(0.6);
        const onlineBG = this.add.image(890, 340, "onlineBG").setVisible(false).setScale(0.6);

        // Botón del chat
        const chatB = this.add.image(1830, 60, "chatB")
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("select");
                this.toggleChatMenu(chatB, [chatFade, BGChat, onlineBG]);
            })
            .on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        chatB.setScale(0.3);
    }

    // Método para obtener los usuarios conectados
    async getConnectedUsers() {
        try {
            const response = await fetch('/api/connected-users', { //llamada a la API
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Username': window.GameData.currentUser // Enviar el nombre del usuario en el encabezado
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }

            const data = await response.json();  // Se asume que la respuesta es un JSON
            console.log("Usuarios conectados:", data);

            // Mostrar los usuarios conectados en el chat (por ejemplo)
            this.showConnectedUsers(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Método para mostrar los usuarios conectados
    showConnectedUsers(users) {

        if (users.length > 0) {
            const usersText = users.join('\n');  // Unir los usuarios en una cadena
            this.userList = this.add.text(800, 300, usersText, {
                fontSize: '45px',
                fill: '#000',
                fontFamily: 'Arial'
            });
            this.userList.setOrigin(0.5);
        }
        
    }


    // Método para alternar la visibilidad de la UI del chat
    toggleChatMenu(chatB, elements) {
        // Verifica si el primer elemento está visible
        const isVisible = elements[0].visible;

        // Alterna la visibilidad de cada elemento
        elements.forEach(element => {
            element.setVisible(!isVisible);
        });

        // Alterna el estado del chat
        this.isChatActive = !isVisible;

        if (this.isChatActive) {
            // Si el chat está activado, obtener los usuarios conectados
            this.getConnectedUsers();
        } else {
            // Si el chat se desactiva, ocultar los usuarios conectados
            this.userList.destroy();
        }

        // Opcional: Imprimir en consola si el chat está activo o no
        console.log(this.isChatActive ? "Chat activado" : "Chat desactivado");
    }


    update(){}



}