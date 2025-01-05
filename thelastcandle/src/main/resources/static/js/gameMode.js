class GameModeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameModeScene' });
    }
    
    preload() {
        this.load.audio("select", 'assets/select.mp3');
    
        this.load.image("notAble", "assets/UI/NotAbleYet.png");
        this.load.image("PlayModeBG", "assets/UI/PlayMode.jpg");
        this.load.image("localB", "assets/UI/localB.png");
        this.load.image("onlineB", "assets/UI/onlineB.png");
        
        this.load.image("return", "assets/UI/return.png");
    }
    
    create() {
        // Imagen de fondo
        const background = this.add.image(0, 0, "PlayModeBG").setOrigin(0, 0);
        background.setDisplaySize(1920, 1080);

        // Boton Local
        const localB = this.add.image(600, 675, "localB")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("GameMode");
            this.scene.start("TutorialScene");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        localB.setScale(0.7,0.7);
    
        // Boton Online
        const onlineB = this.add.image(1300, 675, "onlineB")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("GameMode");
            this.scene.start("LoadingOnlineScene",{ online: true });   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        onlineB.setScale(0.7,0.7);
    }

    update() {
    }
}