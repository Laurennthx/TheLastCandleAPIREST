class WelcomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WelcomeScene' });

    }

    preload() {
        this.load.audio("select", 'assets/Music/effects/click/oldRadio.mp3');
        this.load.audio("hover", 'assets/Music/effects/click/darkButton.mp3');
        this.load.audio("background", 'assets/8bit-music.mp3');

        this.load.image("BGimage", "assets/UI/theLastCandle.jpg");
        this.load.image("start_button", "assets/start-button.svg");
        this.load.image("exit_button", "assets/exit-button.svg");
    }

    create() {

        // imagen de fondo
        const background = this.add.image(0, 0, "BGimage").setOrigin(0, 0);
        background.setDisplaySize(1920, 1080);

        window.GameData = {
            currentUser: null, // Para guardar el usuario con el que se inicia sesión
        };

        // Detectar cualquier tecla presionada para avanzar de escena
        this.input.keyboard.on('keydown', () => {
            this.sound.play("select"); // sonido de selección
            this.scene.stop("WelcomeScene"); // detener escena actual
            this.scene.start("UserScene"); // iniciar siguiente escena
        });

        // Detectar clic del ratón para avanzar de escena
        this.input.on('pointerdown', () => {
            this.sound.play("select"); // sonido de selección
            this.scene.stop("WelcomeScene"); // detener escena actual
            this.scene.start("UserScene"); // iniciar siguiente escena
        });
    }

    update() { }

}
