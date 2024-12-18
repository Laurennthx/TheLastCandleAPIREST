class ChoosingCharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChoosingCharacterScene' });
    }
    
    preload() {
        this.load.audio("select", 'assets/select.mp3');
    
        this.load.image("chooseCharacterBG", "assets/UI/chooseCharacter.jpg");
        this.load.image("chooseDemon", "assets/UI/demonB.png");
        this.load.image("chooseExorcist", "assets/UI/exorcistB.png");
        this.load.image("chooseRandom", "assets/UI/randomB.png");
        this.load.image("randomText", "assets/UI/randomText.png");

        
        this.load.image("continue", "assets/UI/continue.png");
        this.load.image("return", "assets/UI/return.png");
    }
    
    create() {
        // Imagen de fondo
        const background = this.add.image(0, 0, "chooseCharacterBG").setOrigin(0, 0);
        background.setDisplaySize(1920, 1080);

        // Boton Demonio
        const demonB = this.add.image(550, 600, "chooseDemon")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("ChoosingCharacterScene");
            this.scene.start("DemonSkin");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        demonB.setScale(0.7,0.7);

        // Boton exorcista
        const exorcistB = this.add.image(550, 800, "chooseExorcist")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("ChoosingCharacterScene");
            this.scene.start("ExorcistSkin");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        exorcistB.setScale(0.7,0.7);

        // Boton random
        const randomB = this.add.image(1300, 650, "chooseRandom")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            //this.scene.stop("ChoosingCharacterScene");
            //his.scene.start("TutorialScene");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        randomB.setScale(0.7,0.7);

        const text = this.add.image(1300, 800, "randomText")
        text.setScale(0.7,0.7);

        // Boton return
        const returnB = this.add.image(990, 1000, "return")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("ChoosingCharacterScene");
            this.scene.start("MenuScene");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        returnB.setScale(0.4,0.4);



    }
    
    update() {
    }
}