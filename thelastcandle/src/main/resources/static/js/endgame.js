class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    preload() {
        this.load.image("endGameImage", "assets/UI/demonWins.jpg");
        this.load.image("endGameImage2", "assets/UI/demon2Wins.png");
        this.load.image("tryAgain", "assets/UI/tryAgain.png");

    }

    create() {
        const { skinId } = this.scene.settings.data;
        var background 
        // Imagen de fondo
        if(skinId == 2){
            background = this.add.image(0,0, "endGameImage2").setOrigin(0,0);
        }
        else{
            background = this.add.image(0,0, "endGameImage").setOrigin(0,0);
        }

        background.setDisplaySize(1920, 1080);

        const returnButton = this.add.image(960, 1000, "tryAgain")
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("EndScene");
            this.scene.start("MenuScene");   
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });            
        returnButton.setScale(0.4,0.4);

    }

    update() {}

}
