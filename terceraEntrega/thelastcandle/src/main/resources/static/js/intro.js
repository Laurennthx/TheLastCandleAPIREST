class IntroGame extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        this.load.audio("background", 'assets/8bit-music.mp3');
        this.load.audio("introMusic", 'assets/Music/sinister.mp3');

        
        this.load.image("start_button", "assets/start-button.svg");
        this.load.image("exit_button", "assets/exit-button.svg");
    }

    create() {
        const hello_text = this.add.text(150, 50, 'THE LAST CANDLE', { fill: '#000000', fontSize: 100 })
        hello_text.setOrigin(-0.32, -0.3);
        
        this.bgMusic = this.sound.add('introMusic');
        this.bgMusic.loop = true;
        this.bgMusic.play();

        const start_button = this.add.image(900, 400, "start_button")
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("select");
                this.scene.stop("IntroScene");
                this.scene.start("GameScene");
        });
        start_button.setScale(0.5,0.5);
        const exit_button = this.add.image(900, 600, "exit_button");
        

        this.events.on('shutdown', () => {
            this.bgMusic.stop();
        });
        
    }

    update() {}

}
