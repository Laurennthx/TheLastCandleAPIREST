class ChatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatScene' });
    }

    preload() {
        this.load.html('chat', 'chat.html');
        this.soundSend = new Audio('assets/Music/chat effect/sent.mp3'); // Ruta al sonido
        this.soundReceive = new Audio('assets/Music/chat effect/receivedd.mp3'); // Ruta al sonido

    }

    // Útil para cambiar la posición del chat desde otra escena
    changePos(x, y) {
        this.chatElement.setPosition(x, y)
    }


    // Recargar mensajes
    fetchMessages(chatMessages) {
        $.get("/api/chat/", { nMessages: this.nMessages }, function (data) {
            if (data && data.length > 0) {
                chatMessages.innerHTML = ""; 
                data.forEach(msg => {
                    const messageElement = document.createElement("div");
                    messageElement.innerHTML = `<strong>${msg.username}:</strong> ${msg.message}`
                    chatMessages.appendChild(messageElement); 
                });
            }
        });
    }

    // Enviar un mensaje con nombre de usuario y mensaje
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // reproducir sonido
        this.soundSend.play();


        $.ajax({
            url: "/api/chat/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ 
                username: window.GameData.currentUser,
                message: message 
            }), // Enviar como JSON
            success: () => {
                this.chatInput.value = "";
                this.fetchMessages(this.chatMessages);
            },
            error: (xhr) => {
                console.error("Error al enviar el mensaje:", xhr.responseText);
            }
        });
    }

    create() {
        const { posX, posY } = this.scene.settings.data;

        this.chatElement = this.add.dom(0, 0).createFromCache('chat');
        this.chatMessages = this.chatElement.getChildByID('chat-messages');
        this.chatInput = this.chatElement.getChildByID('chat-input');
        this.sendBtn = this.chatElement.getChildByID('send-button');

        this.nMessages = 6;

        // Añadir los eventos
        this.sendBtn.addEventListener('click', this.sendMessage.bind(this));
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Recargar los mensajes cada segundo
        this.time.addEvent({
            delay: 1000,
            callback: () => this.fetchMessages(this.chatMessages),
            loop: true
        });

        this.changePos(posX, posY)
    }

}