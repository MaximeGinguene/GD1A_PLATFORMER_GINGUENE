export class PlatformVertical extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, distance, velocity) {
        super(scene, x, y, distance, velocity);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setTexture("platformImage")
        this.body.allowGravity = false

        this.speed = velocity; // Vitesse de déplacement des plateformes

        this.setSize(96,32)
        this.setOffset(0, 0);


        this.isMovingRight = true; // Changer de direction
        this.setImmovable(true);


        this.startY = this.y; // Position de départ de l'ennemi
        this.endY = this.y + distance; // Position d'arrivée de l'ennemi
        this.isMovingUp = true; // Indicateur de direction initiale
        //this.body.setGravityY(0); // Définir la gravité en Y

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

    }

    handleCollision(platform, player) {
        // Mettre à jour la position du joueur en fonction de la position de la plateforme
        player.y = platform.y - (platform.height / 2) - (player.height / 2);
    }

    update() {
        // Déplacement de la plateforme de haut en bas
        if (this.isMovingUp) {
            //this.y += this.speed; // Déplacement vers le haut.
            this.body.setVelocityY(+this.speed)
            if (this.y >= this.endY) {
                this.isMovingUp = false; // Changer de direction
            }
        } else {
            this.body.setVelocityY(-this.speed)

           
            if (this.y <= this.startY) {
                this.isMovingUp = true; // Changer de direction
            }
        }

        // Vérifier la collision avec le joueur
        this.scene.physics.world.collide(this, this.scene.player, this.handleCollision, null, this);
    }
}