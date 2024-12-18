class GamePruebas extends Phaser.Scene {
    constructor() {
        super({ key: 'GamePruebas' });
    }
        init() {
            this.gameStarted = false;
        }
    
        preload() {
            // Cargar recursos
            this.load.image('exorcist', 'assets/Characters/exorcist.png');
            this.load.image('demon', 'assets/Characters/demon.png');
            this.load.image('divider', 'assets/UI/divider2.png');
            this.load.image('background', 'assets/House/Provisional/mansionConFondo.jpg');
        }
    
        create() {
            // Fondo del mapa
            this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
            this.physics.world.setBounds(0, 0, 9962, 14422); // Límites ajustados
    
            // Crear los personajes
            this.exorcist = this.physics.add.sprite(400, 530, 'exorcist').setScale(0.15);
            this.exorcist.setCollideWorldBounds(true).setImmovable(true).setAllowGravity(false);
    
            this.demon = this.physics.add.sprite(800, 650, 'demon').setScale(0.15);
            this.demon.setCollideWorldBounds(true).setImmovable(true).setAllowGravity(false);
    
            // Divisor visual entre las cámaras
            const divider = this.add.image(this.scale.width / 2, this.scale.height / 2, 'divider').setOrigin(0.5, 0.5);
            divider.setDepth(1); // Asegurar que esté por encima de otros elementos
    
            // Texto inicial
            const helloText = this.add.text(250, 350, 'Press SPACE to start!', { fill: '#000000', fontSize: 40 }).setOrigin(-0.7, 1);
            this.input.keyboard.on('keydown-SPACE', () => {
                if (!this.gameStarted) {
                    helloText.destroy();
                    this.startGame();
                }
            });
    
            // Configurar cámaras
            this.setupCameras(divider, helloText);
    
            // Colisiones entre personajes
            this.physics.add.collider(this.exorcist, this.demon, this.handleCollision, null, this);
    
            // Configurar controles
            this.setupControls();
        }
    
        setupCameras(divider, helloText) {
            // Cámara principal que sigue al exorcista
            this.cameras.main.setSize(this.scale.width / 2, this.scale.height);
            this.cameras.main.startFollow(this.exorcist);
            this.cameras.main.setBounds(0, 0, 800, 800);
    
            // Cámara secundaria que sigue al demonio
            const secondCamera = this.cameras.add(this.scale.width / 2, 0, this.scale.width / 2, this.scale.height);
            secondCamera.startFollow(this.demon);
            secondCamera.setBounds(0, 0, 800, 800);
    
            // Tercera cámara que solo muestra el divisor
            const borderCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
            borderCamera.ignore([this.exorcist, this.demon, this.background, helloText]); // Ignora personajes y fondo
            this.cameras.main.ignore(divider);
            secondCamera.ignore(divider);
        }
    
        setupControls() {
            // Controles del exorcista
            this.input.keyboard.on('keydown-W', () => this.exorcist.setVelocity(0, -200));
            this.input.keyboard.on('keyup-W', () => this.exorcist.setVelocity(0, 0));
            this.input.keyboard.on('keydown-A', () => this.exorcist.setVelocity(-200, 0));
            this.input.keyboard.on('keyup-A', () => this.exorcist.setVelocity(0, 0));
            this.input.keyboard.on('keydown-S', () => this.exorcist.setVelocity(0, 200));
            this.input.keyboard.on('keyup-S', () => this.exorcist.setVelocity(0, 0));
            this.input.keyboard.on('keydown-D', () => this.exorcist.setVelocity(200, 0));
            this.input.keyboard.on('keyup-D', () => this.exorcist.setVelocity(0, 0));
    
            // Controles del demonio
            this.input.keyboard.on('keydown-UP', () => this.demon.setVelocity(0, -200));
            this.input.keyboard.on('keyup-UP', () => this.demon.setVelocity(0, 0));
            this.input.keyboard.on('keydown-LEFT', () => this.demon.setVelocity(-200, 0));
            this.input.keyboard.on('keyup-LEFT', () => this.demon.setVelocity(0, 0));
            this.input.keyboard.on('keydown-DOWN', () => this.demon.setVelocity(0, 200));
            this.input.keyboard.on('keyup-DOWN', () => this.demon.setVelocity(0, 0));
            this.input.keyboard.on('keydown-RIGHT', () => this.demon.setVelocity(200, 0));
            this.input.keyboard.on('keyup-RIGHT', () => this.demon.setVelocity(0, 0));
        }
    
        handleCollision() {
            console.log('Collision detected!');
        }
    
        startGame() {
            this.gameStarted = true;
        }
    
        update() {
            // Actualizaciones del juego
        }
    }
    