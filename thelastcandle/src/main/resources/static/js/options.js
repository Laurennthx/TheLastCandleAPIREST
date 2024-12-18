class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
        
    }
    
    preload() {
        this.load.audio("introMusic", 'assets/Music/sinister.mp3');
        
        this.load.image("OptionsBG", "assets/UI/options.jpg");
        
        this.load.image("on_music", "assets/UI/ON.png");
        this.load.image("off_music", "assets/UI/OFF.png");
        
        this.load.image("backButton", "assets/UI/return.png");
    }
    
    create() {
    
        // imagen de fondo
        const OptionsBG = this.add.image(0,0, "OptionsBG").setOrigin(0,0);
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
        on_music.setScale(0.5,0.5);

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
        off_music.setScale(0.5,0.5);

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
        returnButton.setScale(0.4,0.4);
    
    }
    
    update() {}
    }
    