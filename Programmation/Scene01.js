import { Ennemis } from './ennemis.js';
import { Platform } from './platformGroup.js';
import { PlatformVertical } from './platformVerticaleGroup.js';
import { Memories } from './Collectible.js';
import { Rock } from './RocherGroup.js';
import { Spirits } from './espritfeu.js';







//import { Lumiere } from './LightGroup.js';


var nombre = 0;
var score;

export class Scene01 extends Phaser.Scene {

    constructor() {
        super("Scene01")

        this.isReduced = false; // Déclaration et initialisation de la variable isReduced
        this.canMove = true; // Variable de contrôle pour permettre le mouvement du joueur
        this.playerInitialGravity = 300; // Valeur initiale de la gravité du joueur
        this.emitter = null; // Déclaration de la variable membre emitter  
        this.canPressE = true;
        this.lastCheckpoint = { x: 100, y: 1472 }

    }



    preload() {

        this.load.audio('musique', 'Programmation/assets/MusiqueJeu.mp3');
        this.load.tilemapTiledJSON('map', "Programmation/assets/MapMarioLike.json");
        this.load.image("tileset", "Programmation/assets/Tileset.png");
        this.load.image('box', 'Programmation/assets/rocher.png');
        this.load.image('platformImage', 'Programmation/assets/platform.png');

        this.load.image('projectileImage', 'Programmation/assets/balle.png');

        this.load.image('bulle', 'Programmation/assets/Dialogue.png');

        


        this.load.spritesheet('EnnemyImage', 'Programmation/assets/Esprit1.png', { frameWidth: 40, frameHeight: 40 });


        //background

        this.load.image('background1', 'Programmation/assets/Background.png');
        this.load.image('background2', 'Programmation/assets/background2.png');

        //

        this.load.spritesheet('SouvenirImage', 'Programmation/assets/souvenirspritesheet.png', { frameWidth: 32, frameHeight: 32 });
        //this.load.spritesheet('SouvenirUltime', 'Programmation/assets/CollectBlue.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('particule', 'Programmation/assets/particule.png');
        this.load.spritesheet('checkpoint', 'Programmation/assets/invisible_sprite.png', { frameWidth: 96, frameHeight: 96 });



        ///////Animation joueur/////////////////////
        this.load.spritesheet('spiderman', 'Programmation/assets/colle.png', { frameWidth: 32, frameHeight: 48 });

        this.load.spritesheet('ombreplafond', 'Programmation/assets/ombreplafond.png', { frameWidth: 48, frameHeight: 32 });

        this.load.spritesheet('Course', 'Programmation/assets/CourseTacheSombre.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Essoufle', 'Programmation/assets/idleTacheSombre.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('explosion', 'Programmation/assets/mort.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('saut', 'Programmation/assets/saut.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('death', 'Programmation/assets/dead.png', { frameWidth: 32, frameHeight: 64 });




        //////Collectible Hsitoire/////////////////
        this.load.image('histoire_collectible1', 'Programmation/assets/histoire2.png');
        
        ///Game over
        this.load.spritesheet('GameOverImage', 'Programmation/assets/gameover.png', { frameWidth: 600, frameHeight: 200 });





        // Chargement du méchant de feu.
        this.load.spritesheet('Feu', 'Programmation/assets/secondesprit.png', { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet('Bouledefeu', 'Programmation/assets/fireball.png', { frameWidth: 16, frameHeight: 16 });


        ////////Chargement du Roi des ombres///////////
        this.load.spritesheet('Roi', 'Programmation/assets/Roiombre-Sheet.png', { frameWidth: 32, frameHeight: 48 });




    }
    create() {

        this.musique = this.sound.add('musique', { loop: true });
        this.musique.play();


        // Caméra
        this.cameras.main.setBounds(0, 0, 293 * 32, 50 * 32);
        this.player = this.physics.add.sprite(100, 1472, 'perso').setDepth(100);
        this.cameras.main.setZoom(2.2);
        this.player.setSize(20, 44);
        this.player.setOffset(8, 4);

        const map = this.add.tilemap("map");// ajout map 
        const tiles = map.addTilesetImage("Tileset", "tileset");// ajout collision

        this.add.image(0, 0, 'calque_background').setOrigin(0, 0);


        const calque_ronce = map.createLayer('calque_ronce', tiles);

        this.physics.add.collider(this.player, calque_ronce, this.handlePlayerDeath, null, this);

        calque_ronce.setCollisionByProperty({ estSolide: true });

        this.calque_plateforme = map.createLayer("calque_plateforme", tiles);

        this.add.image(300, 450, 'background1').setScrollFactor(0.5).setDepth(-1);
        this.add.image(1000, 400, 'background2').setScrollFactor(0.6).setDepth(-2);

        this.physics.world.setBounds(0, 0, calque_ronce.width, calque_ronce.height);
        this.player.setCollideWorldBounds(true)

        //spider man


        this.calque_fondu = map.createLayer('calque_fondu', tiles);
        this.calque_fondu.setCollisionByProperty({ estSolide: true });


        this.anims.create({
            key: 'spiderman',
            frames: this.anims.generateFrameNumbers('spiderman', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1

        });

        ///Animation de l'esprit Simple /////////////////


        this.anims.create({
            key: 'EnnemyImage',
            frames: this.anims.generateFrameNumbers('EnnemyImage', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1

        });

        this.anims.create({
            key: 'ombreplafond',
            frames: this.anims.generateFrameNumbers('ombreplafond', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1

        });





        ///Animation de l'esprit Simple /////////////////



        ////////Animation du pousser de box///////


        // Activer la collision entre le joueur et le this.calque_fondu
        this.physics.add.collider(this.calque_fondu, this.player, () => {
            if (this.player.body.blocked.up) this.player.anims.play('ombreplafond', true);
            else this.player.anims.play('spiderman', true);
            clearTimeout(this.player.onWallTimeout);
            this.player.onWall = true;
            this.player.onWallTimeout = setTimeout(() => {
                this.player.onWall = false;
            }, 100);
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-180);
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(180)
            } else {
                this.player.setVelocityY(0)
            }


        }, null, this);

        this.playerInitialGravity = this.player.body.gravity.y;

        this.playerCanMove = true;






        this.calque_plateforme.setCollisionByProperty({ estSolide: true });
        this.physics.add.collider(this.calque_plateforme, this.player);

        ////////////////////////////////////Annimation Esprit Feu ////////////////////////////////////


        // Animation pour Bouledefeu
        this.anims.create({
            key: 'bouledefeu',
            frames: this.anims.generateFrameNumbers('Bouledefeu', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        // Animation pour Feu
        this.anims.create({
            key: 'feu',
            frames: this.anims.generateFrameNumbers('Feu', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'Souvenirs',
            frames: this.anims.generateFrameNumbers('SouvenirImage', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });


        ///////////////////////////////////////////////////////////////////////////////////////////////

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('Course', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1

        });
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('Essoufle', { start: 0, end: 2 }),
            frameRate: 3
        });


        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 8 }),
            frameRate: 14,
            repeat: 0
        });


        this.anims.create({
            key: 'saut',
            frames: this.anims.generateFrameNumbers('saut', { start: 0, end: 2 }),
            frameRate: 3,
            repeat: 0
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(this.player);

        // réduction de taille
        this.input.keyboard.on('keydown-E', () => {
            if (this.canPressE) {
                if (this.isReduced) {
                    this.restorePlayerSize();
                } else {
                    this.reducePlayerSize();
                }
                this.isReduced = !this.isReduced;
                this.canPressE = false; // Désactive la possibilité de presser à nouveau la touche 'E'

                // Temps d'attente avant de pouvoir presser à nouveau la touche 'E' (cooldown de 500 millisecondes)
                this.time.delayedCall(300, () => {
                    this.canPressE = true; // Réactive la possibilité de presser la touche 'E'
                });
            }
        });

        this.player.cantmove = false;


        // Création des plateformes horizontales
        this.platforms0 = new Platform(this, 1495, 917, 460, 1.3);


        this.platforms = new Platform(this, 3075, 429, 140, 2.2);
        this.platforms2 = new Platform(this, 3180, 850, 360, 2.8);

        // Collider des plateformes horizontales
        this.physics.add.collider(this.platforms0, this.player)
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.platforms2, this.player)



        // Création de plateformes verticales
        this.platformsV0 = new PlatformVertical(this, 2160, 900, 650, 150); //Première platforme du jeu

        this.platformsV = new PlatformVertical(this, 3220, 1260, 215, 90);
        this.platformsV2 = new PlatformVertical(this, 3410, 1260, 200, 75);
        this.platformsV3 = new PlatformVertical(this, 3600, 1260, 215, 85);
        this.platformsV4 = new PlatformVertical(this, 3662, 302, 550, 100);


        // Collider des plateformes verticales
        this.physics.add.collider(this.platformsV0, this.player)
        this.physics.add.collider(this.platformsV, this.player)
        this.physics.add.collider(this.platformsV2, this.player)
        this.physics.add.collider(this.platformsV3, this.player)
        this.physics.add.collider(this.platformsV4, this.player)


        /////////////////////////////////////////Création des esprits///////////////////////////////////////////////////

        this.Firespirite = new Spirits(this, 2840, 40 * 32, this.calque_plateforme);
        this.physics.add.collider(this.Firespirite, this.calque_plateforme)

        this.Firespirite.play('feu', true); // Ligne pour Feu


        /////////////////////////////////////////Création des enenmis///////////////////////////////////////////////////

        this.Ennemis1 = new Ennemis(this, 1795, 1088, 100, 40, 200, this.calque_plateforme, this.calque_fondu);
        this.Ennemis2 = new Ennemis(this, 1344, 1056, 100, 40, 200, this.calque_plateforme, this.calque_fondu);
        this.Ennemis3 = new Ennemis(this, 16 * 32, 6 * 32, 120, 70, 120, this.calque_plateforme, this.calque_fondu);
        this.Ennemis4 = new Ennemis(this, 42 * 32, 19 * 32, 100, 40, 100, this.calque_plateforme, this.calque_fondu);
        this.Ennemis5 = new Ennemis(this, 61 * 32, 9 * 32, 100, 40, 200, this.calque_plateforme, this.calque_fondu);
        this.Ennemis6 = new Ennemis(this, 97 * 32, 30 * 32, 100, 40, 200, this.calque_plateforme, this.calque_fondu);


        //Collision des ennemis

        //this.physics.add.collider(this.Ennemis1, this.player)
        this.Ennemis1.play('EnnemyImage');
        this.physics.add.collider(this.Ennemis1, this.calque_plateforme)

        //this.physics.add.collider(this.Ennemis2, this.player)
        this.Ennemis2.play('EnnemyImage');
        this.physics.add.collider(this.Ennemis2, this.calque_plateforme)

        //this.physics.add.collider(this.Ennemis3, this.player)
        this.Ennemis3.play('EnnemyImage');
        this.physics.add.collider(this.Ennemis3, this.calque_plateforme)

        //this.physics.add.collider(this.Ennemis4, this.player)
        this.Ennemis4.play('EnnemyImage');
        this.physics.add.collider(this.Ennemis4, this.calque_plateforme)

        //this.physics.add.collider(this.Ennemis5, this.player)
        this.Ennemis5.play('EnnemyImage');
        this.physics.add.collider(this.Ennemis5, this.calque_plateforme)


        this.Ennemis6.play('EnnemyImage');
        this.physics.add.collider(this.Ennemis6, this.calque_plateforme)



        ////////////////////////////////////////////////////// Boites //////////////////////////////////////////////////

        // Création de la boîte
        this.box = new Rock(this, 635, 1472, 'box');
        this.physics.add.collider(this.calque_plateforme, this.box);
        this.physics.add.collider(this.player, this.box);
        this.physics.add.collider(this.calque_fondu, this.box);

        // Nouvelle boîte
        this.box1 = new Rock(this, 28 * 32, 24 * 32, 'box');
        this.physics.add.collider(this.calque_plateforme, this.box1);
        this.physics.add.collider(this.player, this.box1);
        this.physics.add.collider(this.calque_fondu, this.box1);

        // Nouvelle boîte
        this.box2 = new Rock(this, 76 * 32, 25 * 32, 'box');
        this.physics.add.collider(this.calque_plateforme, this.box2);
        this.physics.add.collider(this.player, this.box2);
        this.physics.add.collider(this.calque_fondu, this.box2);

        // Nouvelle boîte
        this.box3 = new Rock(this, 119 * 32, 42 * 32, 'box');
        this.physics.add.collider(this.calque_plateforme, this.box3);
        this.physics.add.collider(this.player, this.box3);
        this.physics.add.collider(this.calque_fondu, this.box3);


        // Nouvelle boîte
        this.box4 = new Rock(this, 22 * 32, 6 * 32, 'box');
        this.physics.add.collider(this.calque_plateforme, this.box4);
        this.physics.add.collider(this.player, this.box4);
        this.physics.add.collider(this.calque_fondu, this.box4);
        // Nouvelle boîte
        this.box5 = new Rock(this, 4930, 136, 'box');
        this.physics.add.collider(this.calque_plateforme, this.box5);
        this.physics.add.collider(this.player, this.box5);
        this.physics.add.collider(this.calque_fondu, this.box5);

        // Nouvelle boîte
        this.box6 = new Rock(this, 2048, 864, 'box');
        this.physics.add.collider(this.calque_plateforme, this.box6,);
        this.physics.add.collider(this.player, this.box6);
        this.physics.add.collider(this.calque_fondu, this.box6);






        console.log(this.box)
        this.input.keyboard.on('keydown-A', () => {
            if (!this.player.cantmove && !this.player.isAgrippantBox) {
                // Vérifier si le joueur n'est pas déjà en train de saisir une boîte
                const distanceBox = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.box.x, this.box.y);
                const distanceBox1 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.box1.x, this.box1.y);
                const distanceBox2 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.box2.x, this.box2.y);
                const distanceBox3 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.box3.x, this.box3.y);
                const distanceBox4 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.box4.x, this.box4.y);
                const distanceBox5 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.box5.x, this.box5.y);
                const distanceBox6 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.box6.x, this.box6.y);
                if (distanceBox < 100) {
                    this.agripperBox(this.box);
                } else if (distanceBox1 < 100) {
                    this.agripperBox(this.box1);
                } else if (distanceBox2 < 100) {
                    this.agripperBox(this.box2);
                } else if (distanceBox3 < 100) {
                    this.agripperBox(this.box3);
                } else if (distanceBox3 < 100) {
                    this.agripperBox(this.box3);
                } else if (distanceBox4 < 100) {
                    this.agripperBox(this.box4);
                } else if (distanceBox5 < 100) {
                    this.agripperBox(this.box5);
                } else if (distanceBox6 < 100) {
                    this.agripperBox(this.box6);
                }
            }
        });

        this.input.keyboard.on('keyup-A', () => {
            if (this.player.isAgrippantBox) {
                this.lacherBox();
            }
        });



        const particles = this.add.particles('particule');
        this.emitter = particles.createEmitter({
            x: this.player.x,
            y: this.player.y,
            speed: { min: 0, max: 2 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 150,
            blendMode: 'ADD'
        });

        ///////////////////////////// Collectible //////////////////////////////////////////////////////////////////

        this.collectible1 = new Memories(this, 13 * 32, 37 * 32,);
        this.physics.add.collider(this.collectible1.visionBox, this.player, this.handleCollisionWithCollectible, null, this);
        this.collectible1.play('Souvenirs', true);
        this.physics.add.collider(this.collectible1, this.calque_plateforme);



        this.collectible2 = new Memories(this, 3 * 32, 34 * 32);
        this.physics.add.collider(this.collectible2.visionBox, this.player, this.handleCollisionWithCollectible2, null, this);
        this.physics.add.collider(this.collectible2, this.calque_plateforme);
        this.collectible2.play('Souvenirs', true);

        this.collectible3 = new Memories(this, 44 * 32, 19 * 32);
        this.physics.add.collider(this.collectible3.visionBox, this.player, this.handleCollisionWithCollectible3, null, this);
        this.physics.add.collider(this.collectible3, this.calque_plateforme);
        this.collectible3.play('Souvenirs', true);

        this.collectible4 = new Memories(this, 3380, 17 * 32);
        this.physics.add.collider(this.collectible4.visionBox, this.player, this.handleCollisionWithCollectible4, null, this);
        this.physics.add.collider(this.collectible4, this.calque_plateforme);
        this.collectible4.play('Souvenirs', true);

        this.collectible5 = new Memories(this, 1810, 45 * 32);
        this.physics.add.collider(this.collectible5.visionBox, this.player, this.handleCollisionWithCollectible5, null, this);
        this.physics.add.collider(this.collectible5, this.calque_plateforme);
        this.collectible5.play('Souvenirs', true);

        this.collectible6 = new Memories(this, 1495, 46 * 32);
        this.physics.add.collider(this.collectible6.visionBox, this.player, this.handleCollisionWithCollectible6, null, this);
        this.physics.add.collider(this.collectible6, this.calque_plateforme);
        this.collectible6.play('Souvenirs', true);

        this.collectible7 = new Memories(this, 77 * 32, 10 * 32);
        this.physics.add.collider(this.collectible7.visionBox, this.player, this.handleCollisionWithCollectible7, null, this);
        this.physics.add.collider(this.collectible7, this.calque_plateforme);
        this.collectible7.play('Souvenirs', true);

        this.collectible8 = new Memories(this, 164 * 32, 23 * 32);
        this.physics.add.collider(this.collectible8.visionBox, this.player, this.handleCollisionWithCollectible8, null, this);
        this.physics.add.collider(this.collectible8, this.calque_plateforme);
        this.collectible8.play('Souvenirs', true);

        this.collectible9 = new Memories(this, 49 * 32, 35 * 32);
        this.physics.add.collider(this.collectible9.visionBox, this.player, this.handleCollisionWithCollectible9, null, this);
        this.physics.add.collider(this.collectible9, this.calque_plateforme);
        this.collectible9.play('Souvenirs', true);

        this.collectible10 = new Memories(this, 101 * 32, 30 * 32);
        this.physics.add.collider(this.collectible10.visionBox, this.player, this.handleCollisionWithCollectible10, null, this);
        this.physics.add.collider(this.collectible10, this.calque_plateforme);
        this.collectible10.play('Souvenirs', true);

        this.collectible11 = new Memories(this, 2705, 34 * 32);
        this.physics.add.collider(this.collectible11.visionBox, this.player, this.handleCollisionWithCollectible11, null, this);
        this.physics.add.collider(this.collectible11, this.calque_plateforme);
        this.collectible11.play('Souvenirs', true);

        this.collectible12 = new Memories(this, 131 * 32, 38 * 32);
        this.physics.add.collider(this.collectible12.visionBox, this.player, this.handleCollisionWithCollectible12, null, this);
        this.physics.add.collider(this.collectible12, this.calque_plateforme);
        this.collectible12.play('Souvenirs', true);

        this.collectible13 = new Memories(this, 136 * 32, 27 * 32);
        this.physics.add.collider(this.collectible13.visionBox, this.player, this.handleCollisionWithCollectible13, null, this);
        this.physics.add.collider(this.collectible13, this.calque_plateforme);
        this.collectible13.play('Souvenirs', true);

        this.collectible14 = new Memories(this, 212 * 32, 36 * 32);
        this.physics.add.collider(this.collectible14.visionBox, this.player, this.handleCollisionWithCollectible14, null, this);
        this.physics.add.collider(this.collectible14, this.calque_plateforme);
        this.collectible14.play('Souvenirs', true);






        score = this.add.text(625, 325, "0", { fontSize: '32px', fill: '#FF7F00', fontWeight: 'bold' }).setOrigin(0, 0).setScrollFactor(0);
        this.add.image(585, 325, "SouvenirImage").setOrigin(0, 0).setScrollFactor(0).setDepth(250);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////





        this.checkpoint1 = this.physics.add.sprite(34 * 32, 42 * 30, 'checkpoint');
        this.checkpoint2 = this.physics.add.sprite(31 * 33, 31 * 30, 'checkpoint');
        this.checkpoint3 = this.physics.add.sprite(2080, 850, 'checkpoint');
        this.checkpoint4 = this.physics.add.sprite(832, 580, 'checkpoint');
        this.checkpoint5 = this.physics.add.sprite(2900, 700, 'checkpoint');
        this.checkpoint6 = this.physics.add.sprite(30 * 32, 21 * 32, 'checkpoint');
        this.checkpoint7 = this.physics.add.sprite(55 * 32, 8 * 32, 'checkpoint');
        this.checkpoint8 = this.physics.add.sprite(107 * 32, 7 * 32, 'checkpoint');
        this.checkpoint9 = this.physics.add.sprite(3800, 1312, 'checkpoint');
        this.checkpoint10 = this.physics.add.sprite(157*32, 40*32, 'checkpoint');



        // Overlap entre le player et le chekpoint 1
        this.physics.add.overlap(this.player, this.checkpoint1, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

        // Collision entre checkpoin 1 et this.calque_plateforme
        this.physics.add.collider(this.checkpoint1, this.calque_plateforme);

        // Collision entre checkpoint2 et this.calque_plateforme
        this.physics.add.collider(this.checkpoint2, this.calque_plateforme);

        // Overlap entre le player et le chekpoint 2
        this.physics.add.overlap(this.player, this.checkpoint2, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

        // Collision entre checkpoint3 et this.calque_plateforme
        this.physics.add.collider(this.checkpoint3, this.calque_plateforme);

        // Overlap entre le player et le chekpoint 3
        this.physics.add.overlap(this.player, this.checkpoint3, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

        // Collision entre checkpoint3 et this.calque_plateforme
        this.physics.add.collider(this.checkpoint4, this.calque_plateforme);

        // Overlap entre le player et le chekpoint 4
        this.physics.add.overlap(this.player, this.checkpoint4, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

        // Collision entre checkpoint5 et this.calque_plateforme
        this.physics.add.collider(this.checkpoint5, this.calque_plateforme);

        // Overlap entre le player et le chekpoint 5
        this.physics.add.overlap(this.player, this.checkpoint5, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

        // Collision entre checkpoint6 et this.calque_plateforme
        this.physics.add.collider(this.checkpoint6, this.calque_plateforme);

        // Overlap entre le player et le chekpoint 5
        this.physics.add.overlap(this.player, this.checkpoint6, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

        // Collision entre checkpoint7  et this.calque_plateforme
        this.physics.add.collider(this.checkpoint7, this.calque_plateforme);

        // Overlap entre le player et le chekpoint 5
        this.physics.add.overlap(this.player, this.checkpoint7, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

        // Collision entre checkpoint8  et this.calque_plateforme
        this.physics.add.collider(this.checkpoint8, this.calque_plateforme);

        // Overlap entre le player et le chekpoint 8
        this.physics.add.overlap(this.player, this.checkpoint8, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

        // Collision entre checkpoint9  et this.calque_plateforme
        this.physics.add.collider(this.checkpoint9, this.calque_plateforme);

        // Overlap entre le player et le chekpoint 9
        this.physics.add.overlap(this.player, this.checkpoint9, () => {
            this.lastCheckpoint.x = this.player.x;
            this.lastCheckpoint.y = this.player.y;
        }, null, this);

         // Collision entre checkpoint 10 et this.calque_plateforme
         this.physics.add.collider(this.checkpoint10, this.calque_plateforme);

         // Overlap entre le player et le chekpoint 5
         this.physics.add.overlap(this.player, this.checkpoint10, () => {
             this.lastCheckpoint.x = this.player.x;
             this.lastCheckpoint.y = this.player.y;
         }, null, this);
 






        this.anims.create({
            key: 'GameOverImage', // Utilisez la même clé que celle définie pour l'animation
            frames: this.anims.generateFrameNumbers('GameOverImage', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        ///////GAME OVER//////
        this.isGameOver = false;
        this.gameOverImage = this.add.sprite(675, 440, 'GameOverImage').setOrigin(0, 0).setScrollFactor(0).setDepth(250);
        this.gameOverImage.setVisible(false);


        ///////Chargement anime du Roi//////////

        // Créez l'animation "Roi"
        this.anims.create({
            key: 'Roi',
            frames: this.anims.generateFrameNumbers('Roi', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        // Créez le sprite "roi"


        this.bulle = this.add.sprite(195, 1448, 'bulle').setInteractive().on("pointerdown",()=>{
            this.interractionRoi=this.add.image(445,1500,'histoire_collectible1').setInteractive().setDepth(2000).on("pointerdown",()=>{
              this.interractionRoi.destroy()
            })
        })

        this.roi = this.add.sprite(180, 1480, 'Roi');
        this.roi.anims.play('Roi', true);

   




    }


    showGameOver() {
        // Affiche l'écran de Game Over
        this.gameOverImage.setVisible(true);
        this.canRestart = true;
        this.gameOverImage.anims.play('GameOverImage', true); // Utilisez la clé correcte pour lancer l'animation

        // Ajoute un écouteur d'événement pour détecter lorsque le joueur appuie sur la touche 'r'
        this.input.keyboard.on('keydown-Y', this.restartGame, this);
    }

    handlePlayerDeath() {
        if (this.isRestarting) {
            return;  // Si le redémarrage est déjà en cours, ignore l'appel
        }

        this.isRestarting = true;
        this.canMove = false;
        this.player.anims.play('death', true);

        // Temporisation pour attendre la fin de l'animation
        this.time.delayedCall(800, this.showGameOver, [], this);
    }

    restartGame() {
        // Réinitialisation de la position du joueur
        this.player.setX(this.lastCheckpoint.x);
        this.player.setY(this.lastCheckpoint.y);

        // Réactivation du mouvement du joueur
        this.canMove = true;

        this.isRestarting = false;  // Réinitialise la variable de contrôle
        this.gameOverImage.setVisible(false);
    }



    handleCollisionWithCollectible(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible1.image.setVisible(true);
        this.collectible1.setVisible(false);
        this.collectible1.setActive(false);

        // Supprimer la hitbox du collectible
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible2(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible2.image.setVisible(true);
        this.collectible2.setVisible(false);
        this.collectible2.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);



    }

    handleCollisionWithCollectible3(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible3.setVisible(false);
        this.collectible3.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }


    handleCollisionWithCollectible4(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible4.setVisible(false);
        this.collectible4.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }


    handleCollisionWithCollectible5(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible5.setVisible(false);
        this.collectible5.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible6(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible6.setVisible(false);
        this.collectible6.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible7(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible7.setVisible(false);
        this.collectible7.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible8(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible8.setVisible(false);
        this.collectible8.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible9(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible9.setVisible(false);
        this.collectible9.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }


    handleCollisionWithCollectible10(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible10.setVisible(false);
        this.collectible10.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible11(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible11.setVisible(false);
        this.collectible11.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible12(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible12.setVisible(false);
        this.collectible12.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible13(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible13.setVisible(false);
        this.collectible13.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    handleCollisionWithCollectible14(visionBox, player) {
        // Faire disparaître l'allié
        this.collectible14.setVisible(false);
        this.collectible14.setActive(false);

        // Supprimer la hitbox de l'allié
        visionBox.destroy();

        nombre++;
        score.setText(+ nombre);

    }

    agripperBox(box) {
        this.player.isAgrippantBox = true;
        this.cameras.main.shake(200, 0.001); // Déclenche un léger tremblement de caméra
        this.isCameraShaking = true; // La caméra est en train de trembler  
        this.boxAgrippee = box;
    }

    lacherBox() {
        this.player.isAgrippantBox = false;
        this.boxAgrippee.setVelocityX(0);
        this.isCameraShaking = false; // La caméra a arrêté de trembler
        this.boxAgrippee = null;
    }

    restorePlayerSize() {
        this.player.setScale(1);
        if (this.player.body.blocked.right) {
            this.player.x -= this.player.width / 2;
        }
        if (this.player.body.blocked.left) {
            this.player.x += this.player.width / 2;
        }
        if (this.player.body.blocked.down) {
            this.player.y -= this.player.height / 2;
        }
    }

    reducePlayerSize() {
        this.player.setScale(0.5);
    }



    destroy() {
        this.particles.destroy();
    }

    update() {

        if (nombre == 14){

            this.scene.start('Fin')
        }




        if (this.player.body.blocked.down) {
            this.player.grounded = true;
        }
        else {
            setTimeout(() => {
                this.player.grounded = this.player.body.blocked.down;
            }, 75);
        }

        setTimeout(() => {
            this.canMoveOnFondu = false;
        }, 100);


        if (this.player.cantmove) return;

        if (this.canMove) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-180);
                if (!this.player.onWall) this.player.anims.play('left', true);
                this.player.setFlipX(true); // Correction : setFlipX à true

            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(180);
                if (!this.player.onWall) this.player.anims.play('left', true);
                this.player.setFlipX(false); // Correction : setFlipX à false

            } else {
                this.player.setVelocityX(0);
                if (!this.player.onWall) this.player.anims.play('turn', true);
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.player.grounded) {
                this.player.setVelocityY(-300);
                if (!this.player.onWall) this.player.anims.play('saut');
            }
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }

        if (this.player.isAgrippantBox) {
            const box = this.boxAgrippee;
            if (this.player.body.blocked.right) {
                box.setVelocityX(100);
            }
            if (this.player.body.blocked.left) {
                box.setVelocityX(-100);
            }
        }

        // Si le joueur est petit il ne peut pas bouger les box

        if (this.isReduced) {
            this.player.setGravity(0, 150);
            this.box.body.moves = false; // Désactive le mouvement de la boîte lorsque le joueur est réduit
            this.box2.body.moves = false; // Désactive le mouvement de la boîte lorsque le joueur est réduit
            this.box1.body.moves = false; // Désactive le mouvement de la boîte lorsque le joueur est réduit
            this.box4.body.moves = false; // Désactive le mouvement de la boîte lorsque le joueur est réduit
            this.box5.body.moves = false; // Désactive le mouvement de la boîte lorsque le joueur est réduit
            this.box3.body.moves = false; // Active le mouvement de la boîte lorsque le joueur n'est pas réduit
            this.box6.body.moves = false; // Active le mouvement de la boîte lorsque le joueur n'est pas réduit


        } else {
            this.player.setGravity(0, 0);
            this.box.body.moves = true; // Active le mouvement de la boîte lorsque le joueur n'est pas réduit
            this.box2.body.moves = true; // Active le mouvement de la boîte lorsque le joueur n'est pas réduit
            this.box1.body.moves = true; // Active le mouvement de la boîte lorsque le joueur n'est pas réduit
            this.box3.body.moves = true; // Active le mouvement de la boîte lorsque le joueur n'est pas réduit
            this.box5.body.moves = true; // Active le mouvement de la boîte lorsque le joueur n'est pas réduit
            this.box4.body.moves = true; // Désactive le mouvement de la boîte lorsque le joueur est réduit
            this.box6.body.moves = true; // Désactive le mouvement de la boîte lorsque le joueur est réduit
        }







        // Utilisez this.emitter pour accéder à l'objet emitter dans la fonction update()
        this.emitter.setPosition(this.player.x, this.player.y);





    }
}










