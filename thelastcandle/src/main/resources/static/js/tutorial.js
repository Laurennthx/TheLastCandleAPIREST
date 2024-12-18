class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
        this.clickCount = 0; // Contador de clics
    }
    
    preload() {
        this.load.image("TutorialExorcista", "assets/UI/tutExorcista2.jpg");
        this.load.image("TutorialDemonio", "assets/UI/tutDemonio2.jpg");
        this.load.audio("hover", "assets/Music/effects/hover.mp3"); // Cargar el sonido
    }
    
    create() {
        // Imagen de fondo
        const tutorialExorcista = this.add.image(0, 0, "TutorialExorcista").setOrigin(0, 0);
        tutorialExorcista.setDisplaySize(1920, 1080);

        // Botón invisible que ocupa toda la pantalla
        const switchButton = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0)
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("hover"); // Reproducir efecto de sonido
                this.clickCount++; // Incrementar el contador de clics

                if (this.clickCount === 1) {
                    tutorialExorcista.setTexture("TutorialDemonio"); // Cambiar a la imagen del demonio
                } else if (this.clickCount === 2) {
                    this.scene.stop("TutorialScene"); // Detener la escena actual
                    this.scene.start("LoadingScene"); // Pasar a la LoadingScene
                    this.clickCount = 0;                  
                }
            });
    }
    
    update() {
    }
}
