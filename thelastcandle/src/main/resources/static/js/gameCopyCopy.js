class GameSceneCopyCopy extends Phaser.Scene {
    constructor() {
        super({ key: 'GameSceneCopyCopy' });
    }

    init() {
        this.gameStarted = false;
        this.score = 0;
    }

    preload() {
        this.load.image('wall', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/block.png');

        this.load.image('background', 'assets/House/Provisional/mansionConFondo.jpg')

        this.load.image('exorcist', 'assets/Characters/exorcist.png');

        this.load.image('block', 'assets/Pruebas/block.png')


    }
    
    create() {
        const zoomCamara = 2.5
        const height = this.scale.height
        const width = this.scale.width

        // Enable lights in the scene
        this.lights.enable();
        this.lights.setAmbientColor(0x222222);


        this.bgContainer = this.add.container(0, 0)
        // Crear el mapa como fondo, dimensiones: 9962 x 15522
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0)

        
    
        // Add walls with physics bodies
        this.walls = this.physics.add.group();
        const block = this.walls.create(4100, 2050, 'block').setOrigin(0.5, 0.5)
        block.body.setImmovable(true)   // Las paredes deben tener esto activado, los personajes no
        block.alpha = 1
        block.displayWidth = 500
        block.displayHeight = 500
    
        // Se añaden en el grupo todos los elementos del background para escalarlos juntos
        this.bgContainer.add([background, block])
        this.escalaFondo = this.scale.height / background.height
        this.bgContainer.setScale(this.escalaFondo)
        

        // Create ball
        this.exorcist = this.physics.add.sprite(200, 200, 'exorcist');
        this.exorcist.setCollideWorldBounds(true);
        this.exorcist.setScale(0.03, 0.03);
        this.exorcist.body.setAllowGravity(false);
        //this.exorcist.body.setImmovable(true);

    
        this.physics.add.collider(this.exorcist, block, this.hitBLock, null, this); // LLama a la función "hitGround" cuando colisionan


        // console.log(wall1.displayWidth)
        // wall1.setScale(0.2, 0.2)
        // console.log(wall1.displayWidth)
        //this.walls.setDisplaySize(0)
    
        // Add a light source
        this.light = this.lights.addLight(400, 300, 300, 0xffffff, 1);
    
        // Set up light2d pipeline
        const light2d = this.renderer.pipelines.get('Light2D');
        if (light2d) {
            //this.cameras.main.setPipeline('Light2D');
        }
    
        // Make objects affected by lighting
        [background,...this.walls.getChildren()].forEach(obj => obj.setPipeline('Light2D'));
    
        // Create shadow graphics
        this.shadowGraphics = this.add.graphics();
    
        //this.cameras.main.ignore([this.shadowGraphics, this.light])
        // Add text instructions
        //this.add.text(16, 16, 'Move mouse to control light', { fontSize: '18px', fill: '#ffffff' });

        this.cameras.main.setSize(this.scale.width / 2, this.scale.height)
        this.cameras.main.startFollow(this.exorcist)
        this.cameras.main.setZoom(zoomCamara)

        this.setupPaddleControllersExorcist();
    }

    setupPaddleControllersExorcist() {
        this.input.keyboard.on('keydown-A', () => {
            this.exorcist.setVelocity(-200, 0);
        });

        this.input.keyboard.on('keyup-A', () => {
            this.exorcist.setVelocity(0);
        });

        this.input.keyboard.on('keydown-W', () => {
            this.exorcist.setVelocity(0, -200);
        });

        this.input.keyboard.on('keyup-W', () => {
            this.exorcist.setVelocity(0);
        });

        this.input.keyboard.on('keydown-S', () => {
            this.exorcist.setVelocity(0, 200);
        });

        this.input.keyboard.on('keyup-S', () => {
            this.exorcist.setVelocity(0);
        });

        this.input.keyboard.on('keydown-D', () => {
            this.exorcist.setVelocity(200, 0);
        });

        this.input.keyboard.on('keyup-D', () => {
            this.exorcist.setVelocity(0);
        });
    }
    
    hitBLock() {
        console.log('choque')
    }

    update() {
        // Update light position based on mouse position
        const pointer = this.input.activePointer;
        if (this.light) {
            this.light.x = this.exorcist.x;
            this.light.y = this.exorcist.y;
        }
    
        // Clear previous shadows
        if (this.shadowGraphics) {
            this.shadowGraphics.clear();
        }
    
        // Cast shadows for each wall
        this.walls.getChildren().forEach(wall => {
            this.castShadow.call(this, wall);
        });
    }
    
    castShadow(wall) {
        if (!this.light || !wall) return;
    
        const shadowLength = 1000;
        const lightX = this.light.x;
        const lightY = this.light.y;
    
        // Calculate the corners of the wall
        const corners = [
            { x: wall.x * this.escalaFondo - wall.displayWidth * this.escalaFondo / 2, y: wall.y * this.escalaFondo - wall.displayHeight * this.escalaFondo / 2 },
            { x: wall.x * this.escalaFondo + wall.displayWidth * this.escalaFondo / 2, y: wall.y * this.escalaFondo - wall.displayHeight * this.escalaFondo / 2 },
            { x: wall.x * this.escalaFondo + wall.displayWidth * this.escalaFondo / 2, y: wall.y * this.escalaFondo + wall.displayHeight * this.escalaFondo / 2 },
            { x: wall.x * this.escalaFondo - wall.displayWidth * this.escalaFondo / 2, y: wall.y * this.escalaFondo + wall.displayHeight * this.escalaFondo / 2 }
        ];
    
        // Cast shadow for each face of the wall
        for (let i = 0; i < corners.length; i++) {
            const j = (i + 1) % corners.length;
            const p1 = corners[i];
            const p2 = corners[j];
    
            // Check if the face is visible to the light
            if (this.isFaceVisible(lightX, lightY, p1, p2)) {
                const dx1 = p1.x - lightX;
                const dy1 = p1.y - lightY;
                const dx2 = p2.x - lightX;
                const dy2 = p2.y - lightY;
    
                const endP1 = {
                    x: p1.x + dx1 * shadowLength / Math.sqrt(dx1 * dx1 + dy1 * dy1),
                    y: p1.y + dy1 * shadowLength / Math.sqrt(dx1 * dx1 + dy1 * dy1)
                };
                const endP2 = {
                    x: p2.x + dx2 * shadowLength / Math.sqrt(dx2 * dx2 + dy2 * dy2),
                    y: p2.y + dy2 * shadowLength / Math.sqrt(dx2 * dx2 + dy2 * dy2)
                };
    
                // Draw shadow
                if (this.shadowGraphics) {
                    this.shadowGraphics.fillStyle(0x000000, 0.7);
                    this.shadowGraphics.beginPath();
                    this.shadowGraphics.moveTo(p1.x, p1.y);
                    this.shadowGraphics.lineTo(p2.x, p2.y);
                    this.shadowGraphics.lineTo(endP2.x, endP2.y);
                    this.shadowGraphics.lineTo(endP1.x, endP1.y);
                    this.shadowGraphics.closePath();
                    this.shadowGraphics.fillPath();
                }
            }
        }
    }
    
    isFaceVisible(lightX, lightY, p1, p2) {
        // Calculate the normal vector of the face
        const nx = -(p2.y - p1.y);
        const ny = p2.x - p1.x;
    
        // Calculate the vector from p1 to the light
        const dx = lightX - p1.x;
        const dy = lightY - p1.y;
    
        // If the dot product is positive, the face is visible to the light
        return (nx * dx + ny * dy) > 0;
    }
    
}