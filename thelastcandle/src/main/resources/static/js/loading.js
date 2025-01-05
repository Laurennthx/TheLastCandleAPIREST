class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // Carga la imagen de fondo para la pantalla de carga
        this.load.image('LoadingBG', 'assets/UI/Loading.jpg');

        // AUDIOS
        this.load.audio("pickUpCandle", 'assets/Music/effects/candle/putItem.mp3');
        this.load.audio("LightCandle", 'assets/Music/effects/candle/lightItem.mp3');
        this.load.audio("match", 'assets/Music/effects/candle/match.mp3');
        this.load.audio("switch", 'assets/Music/effects/interruptor/switch.mp3');
        this.load.audio("crucifix", 'assets/Music/effects/crucifix/chakra7.mp3');

        // Mostrar la imagen de fondo
        this.load.once('filecomplete-image-LoadingBG', () => {
            this.add.image(this.scale.width / 2, this.scale.height / 2, 'LoadingBG')
                .setOrigin(0.5)
                .setDisplaySize(this.scale.width, this.scale.height);
        });

        // Load game assets
        this.load.image('exorcist', 'assets/Characters/exorcist.png');
        this.load.image("demon", "assets/Characters/demon.png");

        // divider image
        this.load.image('divider', 'assets/UI/divider5.png');

        // map
        this.load.image('background1', 'assets/House/fondo3pentagonosPeque1.png')
        this.load.image('background2', 'assets/House/fondo3pentagonosPeque2.png')
        this.load.image('background3', 'assets/House/fondo3pentagonosPeque3.png')
        this.load.image('background4', 'assets/House/fondo3pentagonosPeque4.png')
        this.load.image('background5', 'assets/House/fondo3pentagonosMueblesPeque4.png')

        // muebles
        this.load.image('bookshelf', 'assets/Decorations_hide/Bookshelf.png')
        this.load.image('bookshelf1', 'assets/Decorations_hide/Bookshelf1.png')
        this.load.image('cupboardHL', 'assets/Decorations_hide/CupboardHLeft.png')
        this.load.image('cupboardHR', 'assets/Decorations_hide/CupboardHRight.png')
        this.load.image('cupboardV', 'assets/Decorations_hide/CupboardV.png')

        // crucifix
        this.load.image('crucifix', 'assets/Objects/crucifix.png')

        // velas
        this.load.image('candle', 'assets/Objects/velaApagada.png')
        this.load.image('candleOn', 'assets/Objects/velaEncendida.png')

        // estrellas de ritual 
        this.load.image('ritual', 'assets/Objects/star.png');

        // gradiente negro 
        this.load.image('gradiente', 'assets/Pruebas/gradiente.png');

        // interruptores
        this.load.image('switch_on', 'assets/Objects/switch_on.png');
        this.load.image('switch_off', 'assets/Objects/switch_off.png');

        // Caja de prueba para testear cosas
        this.load.image('block', 'assets/Pruebas/block.png')
        this.load.image('collider1_2', 'assets/House/collider1_2.png');

        // botón de return
        this.load.image('return', 'assets/UI/return.png');

        // textBox Exorcista gana
        this.load.image('textBoxExorcist', 'assets/UI/textBox.png');
        // textBox Demonio gana
        this.load.image('textBoxDemon', 'assets/UI/demonTextBox.png');

        // Animación exorcista
        this.load.spritesheet('exorcistWalk', 'assets/Animations/Exorcista/Exorcista/spriteSheetExorcista.png', {
            frameWidth: 1100,  // Ancho de cada fotograma
            frameHeight: 1920  // Altura de cada fotograma
        });

        this.load.spritesheet('demonWalk', 'assets/Animations/Demonio/Demonio/spriteSheetDemonio.png', {
            frameWidth: 1280,  // Ancho de cada fotograma
            frameHeight: 1853  // Altura de cada fotograma
        });
    }

    create() {
        //Parámetro para ir al juego online o no
        const { online } = this.scene.settings.data;
        // Iniciar la escena del juego una vez terminada la carga
        if (online != null) {
            if (online == true) {
                this.scene.start('GameOnlineScene');
            }
            else {
                this.scene.start('GameScene');
            }
        }
        else {
            this.scene.start('GameScene');
        }
    }
}
