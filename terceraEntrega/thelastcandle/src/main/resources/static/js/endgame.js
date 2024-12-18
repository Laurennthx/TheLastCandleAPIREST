class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    preload() {
        this.load.image("endGameImage", "assets/UI/DemonWins.jpg");
        this.load.image("tryAgain", "assets/UI/tryAgain.png");

    }

    create(data) {

        // Imagen de fondo
        const background = this.add.image(0,0, "endGameImage").setOrigin(0,0);
        background.setDisplaySize(1920, 1080);

        //const remaining_bricks = data.remaining_bricks;

        //const message = "You lose";

        //const messageText = this.add.text(400, 300, message + '\nClick to restart', {
        //    fontSize: '64px',
        //    fill: '#000000',
       //     align: 'center'
       // }).setOrigin(-0.15,-0.2);

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
