class ExorcistSkin extends Phaser.Scene {
    constructor() {
        super({ key: 'ExorcistSkin' });
        this.activeExorcist = 2; // 1 para demonio 1, 2 para demonio 2
        this.exorcistSprite = null; // Sprite del demonio actual
    }

    preload() {
        this.load.image("bStart", 'assets/UI/start.png');

        this.load.audio("select", 'assets/Music/effects/click/oldRadio.mp3');
        this.load.audio("hover", 'assets/Music/effects/click/darkButton.mp3');

        this.load.image("backgroundSkin", "assets/UI/skin/skinSelectionScene.jpg");
        this.load.image("arrowRight", "assets/UI/skin/arrowRight.png");
        this.load.image("arrowLeft", "assets/UI/skin/arrowLeft.png");
        this.load.image("continueB", "assets/UI/skin/continueB.png");

        // Animación demonio 1
        this.load.spritesheet('exorcist1', 'assets/Animations/Exorcista/Exorcista/spriteSheetExorcista.png', {
            frameWidth: 1100,  // Ancho de cada fotograma
            frameHeight: 1920  // Altura de cada fotograma
        });

        // Animación demonio 2
        this.load.spritesheet('exorcist2', 'assets/Animations/Exorcista2/Exorcista2Spritesheet.png', {
            frameWidth: 1100,
            frameHeight: 1920
        });
    }

    create() {
        // Escena del juego online, donde se envían los mensajes
        this.gameOnlineScene = this.scene.get('GameOnlineScene');

        // Imagen de fondo
        const backgroundSkin = this.add.image(0, 0, "backgroundSkin").setOrigin(0, 0);
        backgroundSkin.setDisplaySize(1920, 1080);

        // Flechas
        const arrowRight = this.add.image(1200, 500, "arrowRight").setOrigin(0, 0).setScale(0.6);
        const arrowLeft = this.add.image(550, 500, "arrowLeft").setOrigin(0, 0).setScale(0.6);

        // Crear animaciones
        this.anims.create({
            key: 'exorcist1Anim',
            frames: this.anims.generateFrameNumbers('exorcist1', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'exorcist2Anim',
            frames: this.anims.generateFrameNumbers('exorcist2', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        // Crear sprite inicial
        this.createExorcistSprite();

        // Interactividad de las flechas
        arrowRight.setInteractive()
            .on('pointerdown', () => {
                this.sound.play('select'); // Reproducir sonido de selección
                this.switchExorcist();
            })
            .on('pointerover', () => {
                this.sound.play('hover'); // Reproducir sonido al pasar el ratón por encima
            });

        arrowLeft.setInteractive()
            .on('pointerdown', () => {
                this.sound.play('select'); // Reproducir sonido de selección
                this.switchExorcist();
            })
            .on('pointerover', () => {
                this.sound.play('hover'); // Reproducir sonido al pasar el ratón por encima
            });



        // boton start
        const start_button = this.add.image(1300, 750, "bStart")
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("select");
                // Enviar skin al sever. Mensaje tipo 's'
                this.gameOnlineScene.sendChosenSkin(this.animationKey)

                // Mostrar texto
                this.errorText.setText("Waiting other player...");
                this.errorText.setAlpha(1); // Mostrar el mensaje

                // Quitar interacción a este botón
                start_button.removeInteractive()
            }).on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        start_button.setScale(0.5, 0.5);

        // Crear un cuadro de texto para mostrar errores
        this.errorText = this.add.text(1300, 820, '', {
            font: '24px Arial',
            fill: '#000000',
            fontFamily: 'Arial',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5, 0.5).setAlpha(0); // Inicialmente invisible

    }

    stopScene() {
        this.scene.stop("ExorcistSkin")
    }

    createExorcistSprite() {
        // Eliminar el sprite anterior si existe
        if (this.exorcistSprite) {
            this.exorcistSprite.destroy();
        }

        // Crear nuevo sprite basado en el demonio activo
        const exorcistKey = this.activeExorcist === 1 ? 'exorcist1' : 'exorcist2';
        this.animationKey = this.activeExorcist === 1 ? 'exorcist1Anim' : 'exorcist2Anim';

        this.exorcistSprite = this.add.sprite(960, 570, exorcistKey);
        this.exorcistSprite.setScale(0.25);
        this.exorcistSprite.play(this.animationKey);
    }

    switchExorcist() {
        // Cambiar entre los demonios
        this.activeExorcist = this.activeExorcist === 1 ? 2 : 1;

        // Crear el nuevo sprite
        this.createExorcistSprite();
    }
}
