export class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distance, velocity) {
        super(scene, x, y, distance, velocity);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setTexture("platformImage")
        this.body.allowGravity = false


        this.speed = velocity; // Vitesse de déplacement des plateformes

        this.setSize(96, 32)
        this.setOffset(0, 0);
        this.isMovingRight = true; // Changer de direction
        this.setImmovable(true);


        this.startX = this.x; // Position de départ de l'ennemi
        this.endX = this.x + distance; // Position d'arrivée de l'ennemi
        this.isMovingRight = true; // Indicateur de direction initiale
        //this.body.setGravityY(0); // Définir la gravité en Y

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

    }

    handleCollision(body) {
        if (body.gameObject === this.scene.player) {
            // Empêcher la plateforme de tomber
            this.body.allowGravity = false;
            this.setImmovable(true);
        }
    }

    update() {
        // Déplacement de la plateforme de gauche à droite
        if (this.isMovingRight) {
            //this.x += this.speed; // Déplacement vers la droite
            this.setVelocityX(this.speed * 60);
            if (this.x >= this.endX) {
                this.isMovingRight = false; // Changer de direction
            }
        } else {
            //this.x -= this.speed; // Déplacement vers la gauche
            this.setVelocityX(-this.speed * 60);
            if (this.x <= this.startX) {
                this.isMovingRight = true; // Changer de direction
            }
        }

        // Détection des collisions entre le joueur et la plateforme
        this.scene.physics.world.collide(this.scene.player,this.calque_plateforme, this);
    }
}    