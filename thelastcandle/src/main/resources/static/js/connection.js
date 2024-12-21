class ConnectionManagerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ConnectionManagerScene', active: true});
        this.connectionOverlay = null;
        this.overlayActive = false;
        this.connectionText = null;
    }
    
    preload(){
        
    }

    create() {
        // Crear el overlay de conexión
        //this.connectionOverlay = new ConnectionOverlay(this.scene);

        // Iniciar verificación periódica
        this.checkServerConnection();
    }

    async checkServerConnection() {
        const serverCheckInterval = 5000; // Intervalo de verificación
        this.connectionTimer = this.time.addEvent({
            delay: serverCheckInterval,
            loop: true,
            callback: async () => {
                try {
                    const response = await fetch('/api/status');
                    if (!response.ok) throw new Error();
                    this.handleConnectionRestored();
                } catch {
                    this.handleConnectionLost();
                }
            }
        });
    }

    handleConnectionLost() {
        if (!this.overlayActive) {
        this.show('Connection to the server lost. Attempting to reconnect...');
        }
        //this.scene.getScenes(true).forEach(scene => {
        //    if (scene.input) scene.input.enabled = false; // Bloquear interacción en todas las escenas activas
        //});
        
    }

    handleConnectionRestored() {
        if (this.overlayActive) {
        this.hide();
        }
        //this.scene.getScenes(true).forEach(scene => {
        //    if (scene.input) scene.input.enabled = true; // Restaurar interacción
        //});
        
    }

    shutdown() {
        if (this.connectionTimer) this.connectionTimer.remove();
    }

    show(message) {
        if (this.overlayActive) return; // Si ya está mostrado, no hacer nada
        this.overlayActive = true;
        // Crear un rectángulo semitransparente
        this.connectionOverlay = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.7);
        this.connectionOverlay.setOrigin(0.5);

        // Crear el texto del mensaje
        this.connectionText = this.add.text(960, 540, message, {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 800 }
        });
        this.connectionText.setOrigin(0.5);
        // Bloquear interacción
        this.input.enabled = false;
    }

    hide() {
        if(!this.overlayActive) return;
        this.overlayActive = false;
        if (this.connectionOverlay) {
            this.connectionOverlay.destroy();
            this.connectionOverlay = null;
        }
        if (this.connectionText) {
            this.connectionText.destroy();
            this.connectionText = null;
        }

        // Restaurar interacción
        this.input.enabled = true;
    }
}



