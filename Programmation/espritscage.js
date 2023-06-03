export class Spirits extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, calque_plateforme, player) {
        super(scene, x, y, 'Feu');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.allowGravity = false;

        this.scene = scene;
        this.calque_plateforme = calque_plateforme;
        this.player = player;

        this.setSize(32, 64);
        this.setOffset(0, 0);

        this.projectileSpeed = 1200; // Vitesse des projectiles en pixels par seconde
        this.projectileDistance = 720; // Distance maximale des projectiles en pixels
        this.projectileAngle = 0; // Angle de tir du projectile en degrés

        this.projectileTimer = scene.time.addEvent({
            delay: 1000, // Délai entre chaque tir en millisecondes (ici, 1 seconde)
            loop: true,
            callback: this.shootFireball,
            callbackScope: this
        });

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    shootFireball() {
        const numProjectiles = 3; // Nombre de projectiles à tirer
        const angleIncrement = 3; // Incrément d'angle entre chaque projectile

        for (let i = 0; i < numProjectiles; i++) {
            const projectile = this.scene.physics.add.sprite(this.x, this.y, 'Bouledefeu');
            const angleInRadians = Phaser.Math.DegToRad(this.projectileAngle + i * angleIncrement);
            const velocityX = -this.projectileSpeed * Math.cos(angleInRadians);
            const velocityY = -this.projectileSpeed * Math.sin(angleInRadians);

            projectile.setVelocity(velocityX, velocityY);
            projectile.setDepth(1);

            this.scene.physics.add.collider(projectile, this.calque_plateforme, () => {
                projectile.destroy(); // Détruire le projectile lors de la collision avec le calque_plateforme
            });

            this.scene.physics.add.collider(projectile, this.player, () => {
                projectile.destroy(); // Détruire le projectile lors de la collision avec le joueur
            });

            this.scene.time.delayedCall(this.projectileDistance / this.projectileSpeed * 1000, () => {
                projectile.destroy();
            });
        }
    }

    update() {
        // Votre logique de mise à jour de l'ennemi ici
    }
}
