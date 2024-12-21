class ChatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatScene' });

    }

    preload() {
        this.load.html('chat', 'chat.html');
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
        const chatElement = this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2)
            .createFromCache('chat');

        this.chatMessages = chatElement.getChildByID('chat-messages');
        this.chatInput = chatElement.getChildByID('chat-input');
        this.sendBtn = chatElement.getChildByID('send-button');

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
    }

}