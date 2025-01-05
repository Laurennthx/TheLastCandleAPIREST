class ExorcistWinsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ExorcistWinsScene' });
    }

    preload() {
        this.load.image("exorcistWinsBG", "assets/UI/ExorcistWins.jpg");
        this.load.image(("exorcist2WinsBG", "assets/UI/Exorcist2Wins.png"));
        this.load.image("tryAgain", "assets/UI/tryAgain.png");

    }

    create(data) {

        // Imagen de fondo
        const background = this.add.image(0,0, "exorcistWinsBG").setOrigin(0,0);
        background.setDisplaySize(1920, 1080);

        this.input.once('pointerdown', () => {
            this.scene.start("MenuScene");
        });

        const returnButton = this.add.image(960, 1000, "tryAgain")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("ExorcistWins");
            this.scene.start("MenuScene");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });             
        returnButton.setScale(0.4,0.4);

    }

    update() {}

}
