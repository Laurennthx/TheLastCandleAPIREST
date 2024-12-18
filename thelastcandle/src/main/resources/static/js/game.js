class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.candleCount = 0; // Contador de velas en el inventario
        this.ritualCount = 0; // Contador de rituales completados

    }

    init() {
        this.gameStarted = false;
        this.score = 0;
    }

    // #region PRELOAD
    preload() {



        // Animación exorcista
        this.load.spritesheet('exorcistWalk', 'assets/Animations/Exorcista/Exorcista/spriteSheetExorcista.png', {
            frameWidth: 1100,  // Ancho de cada fotograma
            frameHeight: 1920  // Altura de cada fotograma
        });

        this.load.spritesheet('demonWalk', 'assets/Animations/Demonio/Demonio/spriteSheetDemonio.png', {
            frameWidth: 1280,  // Ancho de cada fotograma
            frameHeight: 1853  // Altura de cada fotograma
        });

        // menu de pausa
        this.load.image("menuPausaBG", "assets/UI/MenuPausa/menuPausa.png");
        this.load.image("fade", "assets/UI/MenuPausa/fade.png");
        this.load.image("menuB", "assets/UI/MenuPausa/menuB.png");
        this.load.image("newGameB", "assets/UI/MenuPausa/newGame.png");
        this.load.image("offBPausa", "assets/UI/MenuPausa/OffB.png");
        this.load.image("onBPausa", "assets/UI/MenuPausa/OnB.png");
        this.load.image("resumeB", "assets/UI/MenuPausa/resumeB.png");
        this.load.image("pauseB", "assets/UI/MenuPausa/pauseB.png");

    }

    // #region CREATE
    create() {

        this.isPaused = false; // Estado inicial del juego no pausado

        // MUNDO
        const zoomCamara = 4
        const height = this.scale.height
        const width = this.scale.width

        // BOTÓN RETURN TO MENU
        // boton back
        /*const returnButton = this.add.image(1810, 40, "return")
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play("select");
                this.scene.stop("GameScene");
                this.scene.start("MenuScene");
                this.ritualCount = 0;
                this.candleCount = 0;
            })
            .on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        returnButton.setScale(0.28, 0.28);
        */

        // MOVIMIENTO
        this.lastKeyExorcist
        this.lastKeyDemon
        this.keysPressedDe = [[[-1, 0], false], [[0, -1], false], [[0, 1], false], [[1, 0], false]]
        this.keysPressedEx = [[[-1, 0], false], [[0, -1], false], [[0, 1], false], [[1, 0], false]]
        this.speedDe = 150
        this.speedEx = 150
        this.velocidadReducida = 1

        const posInterruptores =
            [[2660, 1240], [6512, 1240], [816, 2176],
            [8698, 13040], [1542, 10940], [6190, 9139],
            [1906, 6976], [4440, 5451], [4734, 3677]]


        this.bgContainer = this.add.container(0, 0)
        // Crear el mapa como fondo, dimensiones: 9962 x 15522
        const background = this.add.image(0, 0, 'background4').setOrigin(0, 0)
        this.crucifix = this.physics.add.sprite(0, 0, 'crucifix').setOrigin(0, 0)    // Iniciar el crucifijo en cualquier parte

        // #region COLLIDERS
        // Ejemplo para que los personajes no puedan atravesar paredes
        this.walls = this.physics.add.group()
        const collider1 = this.createCollider(1737, 876, 6804, 144)
        const collider2 = this.createCollider(1744, 876, 120, 2720)
        const collider3 = this.createCollider(96, 1768, 1784, 168)
        const collider4 = this.createCollider(8360, 888, 168, 2582)
        const collider5 = this.createCollider(4016, 880, 124, 736)
        const collider6 = this.createCollider(5648, 880, 124, 736)
        const collider7 = this.createCollider(4016, 2980, 128, 444)
        const collider8 = this.createCollider(5648, 2980, 128, 444)
        const collider9 = this.createCollider(1745, 3288, 610, 138)
        const collider10 = this.createCollider(3234, 3288, 2898, 138)
        const collider11 = this.createCollider(7023, 3288, 1506, 138)
        const collider12 = this.createCollider(98, 1778, 140, 8902)
        const collider13 = this.createCollider(7762, 3316, 148, 9750)
        const collider14 = this.createCollider(982, 5072, 5893, 182)
        const collider15 = this.createCollider(1732, 4927, 150, 325)
        const collider16 = this.createCollider(6700, 5074, 178, 3808)
        const collider17 = this.createCollider(5802, 8680, 1075, 202)
        const collider18 = this.createCollider(2619, 8680, 2136, 202)
        const collider19 = this.createCollider(92, 8680, 1352, 202)
        const collider20 = this.createCollider(92, 6608, 3880, 158)
        const collider21 = this.createCollider(3839, 6612, 142, 295)
        const collider22 = this.createCollider(3839, 8398, 142, 484)
        const collider24 = this.createCollider(2945, 10494, 739, 230)
        const collider25 = this.createCollider(3534, 10498, 158, 528)
        const collider28 = this.createCollider(3534, 12294, 158, 2899)
        const collider29 = this.createCollider(3546, 15005, 6150, 199)
        const collider30 = this.createCollider(9569, 12632, 145, 2562)
        const collider31 = this.createCollider(7307, 12617, 2406, 218)
        const collider32 = this.createCollider(7758, 14429, 151, 776)
        const collider33 = this.createCollider(5051, 12609, 1351, 234)
        const collider34 = this.createCollider(1290, 12608, 2876, 168)
        const collider35 = this.createCollider(1274, 10498, 170, 2286)
        const collider36 = this.createCollider(100, 10489, 1776, 193)

        // COLLIDERS
        this.grupoRituales = this.physics.add.group()
        const ritual1 = this.grupoRituales.create(512, 7843, 'block').setOrigin(0, 0).setImmovable(true)
        ritual1.displayWidth = 473
        ritual1.displayHeight = 473
        ritual1.alpha = 0

        const ritual2 = this.grupoRituales.create(8540, 14048, 'block').setOrigin(0, 0).setImmovable(true)
        ritual2.displayWidth = 473
        ritual2.displayHeight = 473
        ritual2.alpha = 0

        const ritual3 = this.grupoRituales.create(4679, 2332, 'block').setOrigin(0, 0).setImmovable(true)
        ritual3.displayWidth = 473
        ritual3.displayHeight = 473
        ritual3.alpha = 0


        this.rituals = [ritual1, ritual2, ritual3]; // Lista de colliders de rituales

        // Aplicar setImmovable a todos los objetos en el grupo
        this.walls.children.iterate(function (child) {
            child.setImmovable(true);
        });

        //CONTENEDOR HABITACIONES
        this.roomsContainer = this.add.container(0.0);

        this.bedroom1 = this.add.rectangle(1001.5, 3870, 1495, 2390);
        this.bedroom2 = this.add.rectangle(2934, 2545.5, 2130, 1471);
        this.bedroom3 = this.add.rectangle(7056, 2539, 2566, 1496);
        this.bathroom1 = this.add.rectangle(4886.5, 2533, 1471, 1458);  // Zona ritual arriba
        this.bathroom2 = this.add.rectangle(2512, 12016.5, 2124, 1205);
        this.kitchen = this.add.rectangle(5341.5, 7329.5, 2723, 2693);
        this.diningRoom = this.add.rectangle(2030, 8084.5, 3564, 1175);   // Zona ritual izquierda
        this.storageRoom = this.add.rectangle(8738, 14278, 1634, 1520);   // Zona ritual abajo derecha
        this.livingRoom = this.add.rectangle(5704, 11096.5, 4048, 2977);
        this.hall = this.add.rectangle(1968.5, 10037, 3455, 872);
        this.corridor1 = this.add.rectangle(3229 + 2895 / 2, 4195 + 878 / 2, 2895, 878);
        this.corridor2 = this.add.rectangle(6884 + 868 / 2, 5080 + 4538 / 2, 868, 4538);
        this.hall2 = this.add.rectangle(3700 + 4046 / 2, 13520 + 1500 / 2, 4046, 1500);

        this.roomsContainer.add([this.bedroom1, this.bedroom2, this.bedroom3, this.bathroom1, this.bathroom2, this.kitchen, this.diningRoom,
        this.storageRoom, this.livingRoom, this.hall, this.corridor1, this.corridor2, this.hall2]);
        
        // Obtener la textura de la imagen
        const textura = this.textures.get('background');
        // Acceder a las dimensiones de la textura para escalar todo en base a las coordenadas de la imagen grande original
        const alturaBg = textura.getSourceImage().height;

        this.escalaBg = this.scale.height / alturaBg
        this.roomsContainer.setScale(this.escalaBg);

        
        
        // Poner los interruptores
        this.interruptoresOn = this.physics.add.group(); // Grupo para los interruptores
        this.interruptoresOff = this.physics.add.group(); // Grupo para los interruptores
        this.ponerInterruptores(posInterruptores)

        this.bgContainer.add([background, this.crucifix, ...this.walls.getChildren(), ...this.interruptoresOn.getChildren(), ...this.interruptoresOff.getChildren(), ...this.grupoRituales.getChildren()])
        this.bgContainer.setScale(this.escalaBg)
        background.setScale(alturaBg / background.height)
        

        // Establecer los límites del mundo según el tamaño del mapa
        //this.physics.world.setBounds(0, 0, anchuraBg * this.escalaBg, height);
        // #endregion

        // #region GENERACION VELAS
        // Crear velas
        this.candles = this.physics.add.group(); // Grupo para las velas
        this.generateCandles(5); // Generar 5 velas

        // #region PERSONAJES 
        // Contenedor de personajes
        this.charactersContainer = this.add.container(0, 0)

        // EXORCISTA ANIMACIÓN
        // Crear la animación de caminar
        this.anims.create({
            key: 'walk', // Nombre de la animación
            frames: this.anims.generateFrameNumbers('exorcistWalk', { start: 0, end: 3 }), // Rango de fotogramas
            frameRate: 4, // Velocidad de reproducción (fotogramas por segundo)
            repeat: -1 // Repetir indefinidamente
        });

        // Crear el sprite del exorcista
        this.exorcist = this.physics.add.sprite(400, 530, 'exorcistWalk');
        this.exorcist.setCollideWorldBounds(true);
        this.exorcist.setScale(0.03); // Ajusta el tamaño según tus necesidades

        // DEMONIO ANIMACIÓN
        // Crear la animación de caminar
        this.anims.create({
            key: 'demonWalk', // Nombre de la animación
            frames: this.anims.generateFrameNumbers('demonWalk', { start: 0, end: 3 }), // Rango de fotogramas
            frameRate: 4, // Velocidad de reproducción (fotogramas por segundo)
            repeat: -1 // Repetir indefinidamente
        });

        // Crear el sprite del demonio
        this.demon = this.physics.add.sprite(400, 800, 'demonWalk');
        this.demon.setCollideWorldBounds(true);
        this.demon.setScale(0.035); // Ajusta el tamaño según tus necesidades


        // Añadimos los personajes al contenedor
        this.charactersContainer.add([this.exorcist, this.demon])
        // #endregion

        // #region OBJETOS
        // OBJETOS
        // Las velas se generan antes que los personajes para que no aparezcan visualmente por encima de los personajes

        // Texto de contador e icono en la esquina superior izquierda de las velas 
        this.candleText = this.add.text(20, 20, 'Candles: 0', { fontSize: '30px', color: '#fff' }).setScrollFactor(0);
        this.candleIcon = this.add.image(245, 35, 'candle').setScale(0.05).setVisible(false).setScrollFactor(0);

        // Texto de contador e icono en la esquina superior izquierda de los rituales 
        this.ritualText = this.add.text(20, 60, 'Completed Rituals: 0', { fontSize: '30px', color: '#fff' }).setScrollFactor(0);
        this.ritualIcon = this.add.image(400, 60, 'candleOn').setScale(0.05).setVisible(false).setScrollFactor(0);

        // Texto inmunidad al recoger el crucifijo
        this.crucifixText = this.add.text(20, 100, 'Inmunity', { fontSize: '30px', color: '#FF0000' }).setVisible(false).setScrollFactor(0);

        // #region MUERTE PERSONAJES
        // MATAR AL DEMONIO
        // Botón para matar al demonio
        this.killDemon = this.add.image(480, 900, "textBoxExorcist")
            .setInteractive()
            .on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        this.killDemon.setScale(0.4, 0.4);
        this.killDemon.setVisible(false); // Inicialmente oculto, visible solo cuando sea necesario

        // Verificar en update si se pulsa E
        this.input.keyboard.on('keydown-E', () => {
            if (this.killDemon.visible) { // Solo si el botón es visible
                this.sound.play("select");
                this.scene.stop("gameScene");
                this.scene.start("ExorcistWinsScene");
            }
        });

        // MATAR AL EXORCISTA
        // Botón para matar al exorcista
        this.killExorcist = this.add.image(1480, 900, "textBoxDemon")
            .setInteractive()
            .on('pointerover', () => {
                this.sound.play("hover"); // Reproduce sonido al pasar el cursor
            });
        this.killExorcist.setScale(0.4, 0.4);
        this.killExorcist.setVisible(false); // Inicialmente oculto

        // Verificar en update si se pulsa ENTER
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.killExorcist.visible) { // Solo si el botón es visible
                this.sound.play("select");
                this.scene.stop("gameScene");
                this.scene.start("EndScene");
                this.ritualCount = 0; // Reinicia el contador de rituales
                this.candleCount = 0; // Reinicia el contador de velas
            }
        });


        // Configurar teclas - pulsar E para recoger vela - SOLO EXORCISTA
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey('E');
        this.interactKeyDe = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        // Detectar colisiones con velas
        this.physics.add.overlap(this.exorcist, this.candles, this.collectCandle, null, this);
        // Detectar colisiones con rituales
        this.physics.add.overlap(this.exorcist, this.grupoRituales, this.placeCandle, null, this);
        // Detectar colisión del exorcista con el crucifijo
        this.physics.add.overlap(this.exorcist, this.crucifix, this.cogerCrucifijo, null, this);
        // Detectar colisiones con interruptores
        this.physics.add.overlap(this.exorcist, this.interruptoresOn, this.cambiarInterruptores, null, this);
        this.physics.add.overlap(this.demon, this.interruptoresOn, this.cambiarInterruptores, null, this);
        // Collider del exorcista con el demonio, se podría quitar 
        this.physics.add.collider(this.exorcist, this.demon, this.hitExorcist, null, this); // LLama a la función "hitExorcist" cuando colisionan
        // Activar colisión entre las paredes y el exorcista
        this.physics.add.collider(this.exorcist, this.walls)
        // Activar colisión entre las paredes y el exorcista
        this.physics.add.collider(this.demon, this.walls)


        // CONTROLES PERSONAJES
        this.setupPaddleControllersExorcist();
        this.setupPaddleControllersDemon();

        // DIVIDER PANTALLA
        // Añadir la imagen del marco en el centro de la pantalla
        const divider = this.add.image(this.scale.width / 2, this.scale.height / 2, 'divider')
            .setOrigin(0.5, 0.5); // Centra la imagen en ambos ejes

        // #region LIGHTS 
        this.lights.enable();
        this.lights.setAmbientColor(0xffffff);  // Luces ambientales blancas para así no atenuar el fondo
        this.rLight = 70    // Radio de las luces indicadoras de los interruptores
        this.cd = 3000  // Cooldown de 3 segundos

        // VALOR QUE INDICA SI HA OBTENIDO EL CRUCIFIJO
        this.crucifijoObtenido = false
        this.aura = this.lights.addLight(0, 0, 0, 0xff2a00, 6) // El último valor es la intensidad de la luz

        this.lucesEncendidas = true    // Estado inicial de las luces
        this.cooldownLuces = true

        // Radios del gradiente
        this.vScaleSmall = 0.2
        this.vScaleBig = 1.2

        let visionInicialDemon
        let visionInicialExorcist

        if (this.lucesEncendidas) {
            visionInicialDemon = this.vScaleSmall
            visionInicialExorcist = this.vScaleBig
        }
        else {
            visionInicialDemon = this.vScaleBig
            visionInicialExorcist = this.vScaleSmall
        }

        // Definir los campos de visión de los jugadores; el gradiente negro que hay alrededor de ellos
        this.visionAreaEx = this.add.image(this.exorcist.x, this.exorcist.y, 'gradiente').setOrigin(0.5, 0.5)
        this.visionAreaEx.setScale(visionInicialExorcist, visionInicialExorcist)
        this.visionAreaDe = this.add.image(this.demon.x, this.demon.y, 'gradiente').setOrigin(0.5, 0.5)
        this.visionAreaDe.setScale(visionInicialDemon, visionInicialDemon)

        // Indicar a qué objetos les afecta la luz
        background.setPipeline('Light2D')

        // Arrays de luces que se encienden encima de los interruptores para indicar que pueden ser pulsados
        this.lucesEx = this.ponerLuces(posInterruptores, 0xb8afd0)  // Las luces indicadores del ex. son blancas
        this.lucesDe = this.ponerLuces(posInterruptores, 0xff8e0d)  // Las luces indicadoras del dem. son naranjas
        this.lucesEx.forEach(luz => {
            luz.setPosition(luz.x * this.escalaBg, luz.y * this.escalaBg) // Ajustar la posición de las luces
            luz.setRadius(0)
        })
        this.lucesDe.forEach(luz => {
            luz.setPosition(luz.x * this.escalaBg, luz.y * this.escalaBg) // Ajustar la posición de las luces
            luz.setRadius(0)
        })

        if (this.lucesEncendidas) {
            this.interruptoresOff.children.iterate(function (child) {
                child.alpha = 0;
            });
        }
        else {
            this.interruptoresOn.children.iterate(function (child) {
                child.alpha = 0;
            });
        }

        this.time.delayedCall(5000, () => { // 5 segundos iniciales en el que las luces están encendidas para un jugador
            if (this.lucesEncendidas) {
                this.lucesDe.forEach(luz => {
                    luz.setRadius(this.rLight)
                })
            }
            else {
                this.lucesEx.forEach(luz => {
                    luz.setRadius(this.rLight)
                })
            }
            this.cooldownLuces = false
        })

        this.cambiarInterruptores() // Función que cuando los jugadores interactuan con el interruptor cambian las luces
        // #endregion


        // #region CAMERA
        // Primera cámara que sigue al exorcista
        this.cameras.main.setSize(this.scale.width / 2, this.scale.height)
        this.cameras.main.startFollow(this.exorcist)
        this.cameras.main.setZoom(zoomCamara)

        // Segunda cámara que sigue al demonio
        const scndCamera = this.cameras.add(this.scale.width / 2, 0, this.scale.width / 2, this.scale.height, false, 'demonCamera')
        scndCamera.startFollow(this.demon)
        scndCamera.setZoom(zoomCamara)

        // Tercera cámara que sólo renderiza el borde
        this.marcoCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height)

        // IGNORAR SPRITES:
        // Las cámaras de la pantalla dividida ignoran el marco
        this.cameras.main.ignore([this.visionAreaDe, divider, this.killDemon, this.killExorcist])
        scndCamera.ignore([this.visionAreaEx, divider, this.killDemon, this.killExorcist])

        // Indicar qué luces son visibles para cada personaje
        this.lucesEx.forEach(luzEx => {
            scndCamera.ignore(luzEx)
        })
        this.lucesDe.forEach(luzDe => {
            this.cameras.main.ignore(luzDe)
        })
        // La tercera cámara debe ignorar todos los sprites XD
        this.marcoCamera.ignore([this.charactersContainer, this.bgContainer, this.candles, this.visionAreaEx, this.visionAreaDe, background])

        // #endregion

        // Generar el crucifijo tras 6 segundos de partida
        this.time.addEvent({
            delay: 6000,          // Retraso en milisegundos (6000 ms = 6 segundos)
            callback: this.generateCrucifix,   // Función a llamar después del retraso
            callbackScope: this   // Contexto (scope) de la función, generalmente `this` para acceder a la escena
        });

        // #region MENU DE PAUSA
        // Fondo del menú de pausa
        // Fondo del menú de pausa

        // Efecto de fade
        //this.add.image(400, 300, "fade").setAlpha(1); // Transparencia ajustada con setAlpha


        const menuPausaBG = this.add.image(960, 540, "menuPausaBG"); // Coordenadas y clave de la imagen
        menuPausaBG.setScale(0.85);
        menuPausaBG.setVisible(false);
        
        // Botón de pausa (visible en el HUD del juego)
        let pauseButton = this.add.image(1830, 60, "pauseB").setInteractive();
        pauseButton.on("pointerdown", () => {
            this.sound.play("select");
            console.log("Juego en pausa");
            // Lógica para mostrar el menú de pausa
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor 
        });
        pauseButton.setScale(0.2);

        // Botón de menú principal
        let menuButton = this.add.image(680, 520, "menuB").setInteractive();
        menuButton .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("GameScene");
            this.scene.start("MenuScene"); 
            this.ritualCount = 0;
            this.candleCount = 0;  
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor  
        });
        menuButton.setScale(0.4);
        menuButton.setVisible(false);

        // Botón de nuevo juego
        let newGameButton = this.add.image(680, 620, "newGameB").setInteractive();
        newGameButton .on('pointerdown', () => {
            this.sound.play("select");
            this.scene.stop("GameScene");
            this.scene.start("GameModeScene"); 
            this.ritualCount = 0;
            this.candleCount = 0;  
        }).on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        newGameButton.setScale(0.4);
        newGameButton.setVisible(false);


        // Botón de reanudar juego
        let resumeButton = this.add.image(680, 720, "resumeB").setInteractive();
        resumeButton.on("pointerdown", () => {
            console.log("Reanudar juego");
            // Lógica para cerrar el menú de pausa y continuar
            this.togglePauseMenu(pauseButton, pauseMenuElements);

        });
        resumeButton.setScale(0.42);
        resumeButton.setVisible(false);


        // Botón de sonido Off
        let offButton = this.add.image(1150, 520, "offBPausa").setInteractive();
        offButton.on('pointerdown', () => {
            this.sound.play("select");
            this.bgMusic.stop();  
        })
        .on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        offButton.setScale(0.4);
        offButton.setVisible(false);


        // Botón de sonido On
        let onButton = this.add.image(1150, 620, "onBPausa").setInteractive();
        onButton.on('pointerdown', () => {
            this.sound.play("select");
            this.bgMusic.play();  
        })
        .on('pointerover', () => {
            this.sound.play("hover"); // Reproduce sonido al pasar el cursor
        });  
        onButton.setScale(0.4);
        onButton.setVisible(false);


        // Array con los elementos del menú de pausa
        const pauseMenuElements = [menuPausaBG, menuButton, newGameButton, resumeButton, offButton, onButton];

        // Evento del botón de pausa
        pauseButton.on("pointerdown", () => {
            this.togglePauseMenu(pauseButton, pauseMenuElements);
        });

        scndCamera.ignore([this.visionAreaEx, divider, this.killDemon, this.killExorcist, ...pauseMenuElements])
        this.cameras.main.ignore([this.visionAreaDe, divider, this.killDemon, this.killExorcist, ...pauseMenuElements ])


    }

    // Método para alternar la visibilidad del menú de pausa
    togglePauseMenu(pauseButton, elements) {
        // Verifica si el primer elemento está visible
        const isVisible = elements[0].visible;

        // Alterna la visibilidad de cada elemento
        elements.forEach(element => {
            element.setVisible(!isVisible);
        });

        // Opcional: Imprimir en consola si se activó o desactivó el menú
        console.log(isVisible ? "Menú oculto" : "Menú mostrado");

        this.isPaused = !isVisible;
        if(!isVisible){
            this.resetKeys()
            this.demon.anims.stop('demonWalk'); // parar animación
            this.exorcist.anims.stop('walk'); // parar animación
        } 

    }


    // MÉTODO CREACIÓN DE COLLIDERS
    createCollider(x, y, width, height) {
        const collider = this.walls.create(x, y, 'block').setOrigin(0, 0)
        collider.alpha = 0
        collider.displayWidth = width
        collider.displayHeight = height
        return collider
    }


    // #region METODOS CRUCIFIJO
    generateCrucifix() {
        const texturaCrucifix = this.textures.get('crucifix');
        let escalaCrucifijo = 0.5
        this.crucifix.setScale(escalaCrucifijo)
        const anchuraCrucifix = texturaCrucifix.getSourceImage().width * escalaCrucifijo
        const alturaCrucifix = texturaCrucifix.getSourceImage().height * escalaCrucifijo

        const rooms = [this.bedroom1, this.bedroom2, this.bedroom3, this.bathroom2, this.kitchen, this.livingRoom, this.hall, this.corridor1, this.corridor2, this.hall2]

        const randomRoom = Phaser.Utils.Array.GetRandom(rooms);

        let x = randomRoom.x + Phaser.Math.Between(-randomRoom.width / 2, randomRoom.width / 2 - anchuraCrucifix);
        let y = randomRoom.y + Phaser.Math.Between(-randomRoom.height / 2, randomRoom.height / 2 - alturaCrucifix);

        this.crucifix.setPosition(x, y)
        this.aura.setPosition((x + anchuraCrucifix / 2) * this.escalaBg, (y + alturaCrucifix / 2) * this.escalaBg)
        console.log(this.aura.x, this.aura.y)
        this.aura.setRadius(60).setIntensity(10)

        console.log("Crucifijo generado")
    }

    cogerCrucifijo() {
        this.crucifix.destroy()
        this.aura.setRadius(75).setIntensity(6) // Poner el radio a 75 para que sea visible el aura. Para quitarla poner el radio a 0
        this.crucifijoObtenido = true
        this.crucifixText.setVisible(true);
        this.sound.play("crucifix"); // Reproducir sonido al recoger la vela
    }


    /**
     * Genera las velas en posiciones aleatorias.
     * @param {number} count - Número de velas a generar.
     */

    // #region GENERACION VELAS

    // CREACIÓN ALEATORIA DE VELAS
    generateCandles(count) {
        const texturaVela = this.textures.get('candle');
        const anchuraVela = texturaVela.getSourceImage().width * 0.013 / this.escalaBg
        const alturaVela = texturaVela.getSourceImage().height * 0.013 / this.escalaBg

        const minDistance = 2500; // Distancia mínima entre velas
        const positions = []; // Para almacenar las posiciones ya usadas
        const rooms = [this.bedroom1, this.bedroom2, this.bedroom3, this.bathroom2, this.kitchen, this.livingRoom, this.hall, this.corridor1, this.corridor2, this.hall2]

        // For que se repite count veces, donde count es el numero de velas a generar
        for (let i = 0; i < count; i++) {
            let x, y
            let validPosition
            let minDistanceTemp = minDistance
            let nIteracions = 0
            while (!validPosition) {
                if (nIteracions++ == rooms.length) minDistanceTemp = 0
                // Escoger una habitación al azar
                const randomRoom = Phaser.Utils.Array.GetRandom(rooms);
                let nIntentos = 10  // Va a hacer 10 intentos de encontrar una posición válida en esa habitación

                for (let j = 0; j < nIntentos; j++) {
                    validPosition = true

                    // Generar una posición al azar en esa habitación
                    x = randomRoom.x + Phaser.Math.Between(-randomRoom.width / 2 + 100, randomRoom.width / 2 - anchuraVela);
                    y = randomRoom.y + Phaser.Math.Between(-randomRoom.height / 2, randomRoom.height / 2 - alturaVela);

                    // Asegurarse que no está cerca de ninguna otra vela
                    for (let pos of positions) {
                        const distance = Phaser.Math.Distance.Between(x, y, pos.x, pos.y);
                        if (distance < minDistanceTemp) {
                            validPosition = false;  // Salir del for si hay alguna otra vela cerca
                            break;
                        }
                    }
                    if (validPosition) break // Si ha encontrado una posición válida sale del for. Si no, busca otra posición
                }
            }
            // Guardar la posición y crear la vela
            positions.push({ x, y });
            const candle = this.candles.create(x * this.escalaBg, y * this.escalaBg, 'candle')  // Escalar su posición a la hora de generarlas
            // Configuración de la vela
            candle.setScale(0.013, 0.013)
                .setCollideWorldBounds(true)
                .setImmovable(true); // Evitar que se mueva por colisiones

            candle.body.setAllowGravity(false); // Desactiva la gravedad
        }
    }

    // RECOGER VELA
    collectCandle(exorcist, candle) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.sound.play("pickUpCandle"); // Reproducir sonido al recoger la vela
            candle.destroy(); // Eliminar la vela del mapa
            this.candleCount++; // Aumentar el contador
            this.candleText.setText(`Candles: ${this.candleCount}`); // Actualizar el texto
            this.candleIcon.setVisible(true); // Mostrar el icono
        }
    }

    // #region RITUALES
    // COMPLETAR UN RITUAL
    // Método para colocar una vela en un ritual
    placeCandle(exorcist, ritualCollider) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            // Verificar si hay velas disponibles
            if (this.candleCount > 0) {
                this.sound.play("match");
                this.sound.play("LightCandle");
                // Obtener las coordenadas centrales del ritualCollider
                const bounds = ritualCollider.getBounds();
                const candle = this.add.sprite(
                    bounds.centerX - 1, // Coordenada X central ajustada
                    bounds.centerY - 7, // Coordenada Y central ajustada
                    'candleOn' // Textura de la vela
                ).setScale(0.013); // Ajustar el tamaño si es necesario
                this.marcoCamera.ignore(candle)

                // Reducir el número de velas disponibles
                this.candleCount--;
                this.candleText.setText(`Candles: ${this.candleCount}`); // Actualizar el texto

                // Incrementar el contador de rituales
                this.ritualCount++;
                this.ritualText.setText(`Completed Rituals: ${this.ritualCount}`); // Actualizar el texto de rituales
                this.ritualIcon.setVisible(true); // Mostrar el icono

                // Desactivar el ritualCollider para evitar múltiples activaciones
                ritualCollider.active = false; // Desactiva el collider para futuras colisiones

                // Llama al método para verificar rituales
                this.checkCompletedRituals();
            }
        }
    }

    // COMPROBAR NUMERO RITUALES - MATAR DEMONIO
    // comprueba el numero de rituales y da la opción de matar al demonio 
    checkCompletedRituals() {
        if (this.ritualCount == 3) { // Si se completaron 3 rituales
            this.killDemon.setVisible(true); // Activa la caja de texto
        }
    }

    // #region INTERRUPTORES
    ponerInterruptores(posiciones) {
        const scale = 0.5
        for (let i = 0; i < posiciones.length; i++) {
            const switchOn = this.interruptoresOn.create(posiciones[i][0], posiciones[i][1], 'switch_on').setOrigin(0, 0)
            switchOn.setScale(scale, scale).setImmovable(true)
            switchOn.setPipeline('Light2D')
            const switchOff = this.interruptoresOff.create(posiciones[i][0], posiciones[i][1], 'switch_off').setOrigin(0, 0)
            switchOff.setScale(scale, scale).setImmovable(true)
            switchOff.setPipeline('Light2D')
        }
    }

    // USAR INTERRUPTOR
    cambiarInterruptores(player, interruptor) {
        if (interruptor != undefined) {
            if (player == this.exorcist) {
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    if (!this.lucesEncendidas) {
                        this.encenderLuces()
                    }
                }
            }
            if (player == this.demon) {
                if (Phaser.Input.Keyboard.JustDown(this.interactKeyDe)) {
                    if (this.lucesEncendidas) {
                        this.apagarLuces()
                    }
                }
            }

        }
    }

    // El demonio llama a esta función para apagar las luces
    apagarLuces() {
        if (this.cooldownLuces == false) {
            this.sound.play('switch');
            this.cooldownLuces = true
            this.visionAreaEx.setScale(this.vScaleSmall, this.vScaleSmall)
            this.visionAreaDe.setScale(this.vScaleBig, this.vScaleBig)

            this.interruptoresOn.children.iterate(function (child) {
                child.alpha = 0;
            });
            this.interruptoresOff.children.iterate(function (child) {
                child.alpha = 1;
            });

            this.lucesDe.forEach(luz => {
                luz.setRadius(0)
            })

            this.time.delayedCall(this.cd, () => { // Al terminar el cooldown se enciende un indicador para el exorcista
                this.lucesEncendidas = false
                this.lucesEx.forEach(luz => {
                    luz.setRadius(this.rLight)
                })
                this.cooldownLuces = false
            })
        }
    }

    // El exorcista llama a esta función para encender las luces
    encenderLuces() {
        if (this.cooldownLuces == false) {
            this.sound.play('switch');
            this.cooldownLuces = true
            this.visionAreaEx.setScale(this.vScaleBig, this.vScaleBig)
            this.visionAreaDe.setScale(this.vScaleSmall, this.vScaleSmall)

            this.interruptoresOn.children.iterate(function (child) {
                child.alpha = 1;
            });
            this.interruptoresOff.children.iterate(function (child) {
                child.alpha = 0;
            });

            this.lucesEx.forEach(luz => {
                luz.setRadius(0)
            })

            this.time.delayedCall(this.cd, () => { // Al terminar el cooldown se enciende un indicador para el demonio
                this.lucesEncendidas = true
                this.lucesDe.forEach(luz => {
                    luz.setRadius(this.rLight)
                })
                this.cooldownLuces = false
            })
        }
    }

    ponerLuces(posiciones, color) {
        const arrLuces = []
        for (let i = 0; i < posiciones.length; i++) {
            arrLuces[i] = this.lights.addLight(posiciones[i][0] + 50, posiciones[i][1] + 50, 70, color, 6);
        }
        return arrLuces
    }

    // #region CONTROLES
    setupPaddleControllersDemon() {
        // Key down
        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.demon.anims.play('demonWalk', true); // Reproducir animación
            this.demon.flipX = true; // Voltear el sprite horizontalmente
            this.keysPressedDe[0][1] = true
            this.lastKeyDemon = 0
        });
        this.input.keyboard.on('keydown-UP', () => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.demon.anims.play('demonWalk', true); // Reproducir animación
            this.keysPressedDe[1][1] = true
            this.lastKeyDemon = 1
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.demon.anims.play('demonWalk', true); // Reproducir animación
            this.keysPressedDe[2][1] = true
            this.lastKeyDemon = 2
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.demon.anims.play('demonWalk', true); // Reproducir animación
            this.demon.flipX = false; // Voltear el sprite horizontalmente
            this.keysPressedDe[3][1] = true
            this.lastKeyDemon = 3
        });

        // Key up
        this.input.keyboard.on('keyup-LEFT', (event) => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.keysPressedDe[0][1] = false
            if (this.keysPressedDe[3][1] == true) {
                this.demon.flipX = false; // Si al soltar la A, se estaba moviendo hacia la D, se voltea el sprite
            }
            if (this.characterIsStill(this.demon)) {
                this.demon.anims.stop('demonWalk'); // parar animación
            }
        });
        this.input.keyboard.on('keyup-UP', (event) => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.keysPressedDe[1][1] = false
            if (this.characterIsStill(this.demon)) {
                this.demon.anims.stop('demonWalk'); // parar animación
            }
        });
        this.input.keyboard.on('keyup-DOWN', (event) => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.keysPressedDe[2][1] = false
            if (this.characterIsStill(this.demon)) {
                this.demon.anims.stop('demonWalk'); // parar animación
            }
        });
        this.input.keyboard.on('keyup-RIGHT', (event) => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.keysPressedDe[3][1] = false
            if (this.keysPressedDe[0][1] == true) {
                this.demon.flipX = true; // Si al soltar la A, se estaba moviendo hacia la D, se voltea el sprite
            }
            if (this.characterIsStill(this.demon)) {
                this.demon.anims.stop('demonWalk'); // parar animación
            }
        });
    }

    setupPaddleControllersExorcist() {
        // Key down
        this.input.keyboard.on('keydown-A', () => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.exorcist.anims.play('walk', true); // Reproducir animación
            this.exorcist.flipX = true; // Voltear el sprite horizontalmente
            this.keysPressedEx[0][1] = true
            this.lastKeyExorcist = 0
        });
        this.input.keyboard.on('keydown-W', () => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.exorcist.anims.play('walk', true); // Reproducir animación
            this.keysPressedEx[1][1] = true
            this.lastKeyExorcist = 1
        });
        this.input.keyboard.on('keydown-S', () => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.exorcist.anims.play('walk', true); // Reproducir animación
            this.keysPressedEx[2][1] = true
            this.lastKeyExorcist = 2
        });
        this.input.keyboard.on('keydown-D', () => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.exorcist.anims.play('walk', true); // Reproducir animación
            this.exorcist.flipX = false; // Restaurar orientación original
            this.keysPressedEx[3][1] = true
            this.lastKeyExorcist = 3
        });

        // Key up
        this.input.keyboard.on('keyup-A', (event) => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.keysPressedEx[0][1] = false
            if (this.keysPressedEx[3][1] == true) {
                this.exorcist.flipX = false; // Si al soltar la A, se estaba moviendo hacia la D, se voltea el sprite
            }
            if (this.characterIsStill(this.exorcist)) {
                this.exorcist.anims.stop('walk'); // parar animación
            }
        });
        this.input.keyboard.on('keyup-W', (event) => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.keysPressedEx[1][1] = false
            if (this.characterIsStill(this.exorcist)) {
                this.exorcist.anims.stop('walk'); // parar animación
            }
        });
        this.input.keyboard.on('keyup-S', (event) => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.keysPressedEx[2][1] = false
            if (this.characterIsStill(this.exorcist)) {
                this.exorcist.anims.stop('walk'); // parar animación
            }
        });
        this.input.keyboard.on('keyup-D', (event) => {
            if (this.isPaused) return; // Bloquea acción si está pausado
            this.keysPressedEx[3][1] = false
            if (this.keysPressedEx[0][1] == true) {
                this.exorcist.flipX = true; // Si al soltar la D, se estaba moviendo hacia la A, se voltea el sprite
            }
            if (this.characterIsStill(this.exorcist)) {
                this.exorcist.anims.stop('walk'); // parar animación
            }
        });
    }

    resetKeys(){
        for(let i = 0; i < this.keysPressedEx.length; i++){
            this.keysPressedEx[i][1] = false;
        }
        for(let i = 0; i < this.keysPressedDe.length; i++){
            this.keysPressedDe[i][1] = false;
        }
    }

    characterIsStill(character) {
        var nKeysPressed = 0
        if (character == this.demon) {
            for (let i = 0; i < this.keysPressedDe.length; i++) {
                if (this.keysPressedDe[i][1] == true) {
                    nKeysPressed++
                }
            }
        }
        else if (character == this.exorcist) {
            for (let i = 0; i < this.keysPressedEx.length; i++) {
                if (this.keysPressedEx[i][1] == true) {
                    nKeysPressed++
                }
            }
        }
        return nKeysPressed == 0
    }


    hitExorcist() {
        if (this.crucifijoObtenido) {
            this.crucifijoObtenido = false
            this.crucifixText.setVisible(false);
            this.aura.setRadius(0)
            this.velocidadReducida = 0.3
            this.time.delayedCall(2000, () => { // Cooldown para reducir la velocidad del demonio si pega al exorcista y no le mata
                this.velocidadReducida = 1
            })
        }
        else if (!this.crucifijoObtenido && this.velocidadReducida == 1) {
            this.killExorcist.setVisible(true);
        }
    }

    startGame() {
        this.gameStarted = true;
    }


    // #region UPDATE
    update(time, delta) {
        this.demon.setVelocity(0, 0)
        for (let i = 0; i < this.keysPressedDe.length; i++) {
            if (this.keysPressedDe[i][1] == true) {
                this.demon.setVelocity(this.keysPressedDe[i][0][0] * this.speedDe * this.velocidadReducida, this.keysPressedDe[i][0][1] * this.speedDe * this.velocidadReducida)
                if (this.lastKeyDemon == i) break
            }
        }

        this.exorcist.setVelocity(0, 0)
        for (let i = 0; i < this.keysPressedEx.length; i++) {
            if (this.keysPressedEx[i][1] == true) {
                this.exorcist.setVelocity(this.keysPressedEx[i][0][0] * this.speedEx, this.keysPressedEx[i][0][1] * this.speedEx)
                if (this.lastKeyExorcist == i) break
            }
        }

        this.visionAreaEx.setPosition(this.exorcist.x, this.exorcist.y)
        this.visionAreaDe.setPosition(this.demon.x, this.demon.y)

        if (this.crucifijoObtenido) this.aura.setPosition(this.exorcist.x, this.exorcist.y)
    }
}