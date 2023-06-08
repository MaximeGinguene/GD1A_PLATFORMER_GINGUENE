export class Ennemis extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distance, velocity, visionRadius, calque_plateforme,calque_fondu) {
        super(scene, x, y, distance, velocity, visionRadius, calque_plateforme);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setTexture("EnnemyImage")
        this.body.allowGravity = true

        this.setSize(40, 40)
        this.setOffset(0, 0);

        this.distance = distance; // Distance totale du mouvement horizontal
        this.velocity = velocity; // Vitesse de déplacement horizontal
        this.startX = x; // Position de départ de l'ennemi

        this.scene = scene;
        this.projectileGroup = scene.physics.add.group(); // Groupe pour les projectiles
        this.lastShootTime = 0; // Temps du dernier tir

        this.setVelocityX(this.velocity); // Définir la vitesse de déplacement horizontal

        this.visionRadius = visionRadius; // Rayon du champ de vision
        this.isPlayerDetected = false; // Indicateur de détection du joueur

        // Créer une hitbox pour le champ de vision
        this.visionBox = scene.add.rectangle(x, y, visionRadius * 2, visionRadius * 2, 0xff0000, 0.5);
        this.visionBox.setOrigin(0.5);
        this.visionBox.setVisible(false); // Cacher la visionbox par défaut

        this.calque_plateforme = calque_plateforme;

        this.scene.physics.add.collider(this, calque_plateforme);
        this.scene.physics.add.collider(this, this.scene.calque_fondu);
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    shootProjectile() {
        const player = this.scene.player;

        // Calculer la direction vers laquelle tirer les projectiles
        const directionX = Math.sign(player.x - this.x);
        const directionY = -1; // Toujours tirer vers le haut

        // Créer un projectile
        const projectile = this.projectileGroup.create(this.x, this.y, 'projectileImage');
        projectile.setVelocity(directionX * 100, directionY * 300); // Vitesse du projectile en fonction de la direction

        // Collision entre le projectile et le joueur
        this.scene.physics.add.collider(projectile, player, () => {
            // Action à effectuer lors de la collision entre le projectile et le joueur
            projectile.destroy(); // Supprimer le projectile
            this.scene.handlePlayerDeath(); // Appeler une fonction pour blesser le joueur
        });

        // Collision entre le projectile et le calque de plateforme
        this.scene.physics.add.collider(projectile, this.calque_plateforme, () => {
            this.projectileCollideCallback(projectile);
        });
         // Collision entre le projectile et le calque de plateforme
         this.scene.physics.add.collider(projectile, this.scene.calque_fondu, () => {
            this.projectileCollideCallback(projectile);
        });
    }

   

    projectileCollideCallback(projectile) {
        projectile.destroy(); // Supprimer le projectile lorsqu'il entre en collision avec le calque de plateforme
    }


    update(time) {
        // Mouvement horizontal de gauche à droite
        if (this.x >= this.startX + this.distance) {
            this.setVelocityX(-this.velocity); // Changer de direction vers la gauche
        } else if (this.x <= this.startX) {
            this.setVelocityX(this.velocity); // Changer de direction vers la droite
        }

        // Vérifier la détection du joueur
        const player = this.scene.player;
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distanceToPlayer <= this.visionRadius) {
            this.isPlayerDetected = true;
        } else {
            this.isPlayerDetected = false;
        }

        // Suivre le joueur si détecté
        if (this.isPlayerDetected) {
            const direction = Math.sign(player.x - this.x);
            this.setVelocityX(this.velocity * direction);
        }

        // Mettre à jour la position de la hitbox pour qu'elle suive l'ennemi
        this.visionBox.setPosition(this.x, this.y);

        // Tirer des projectiles si le joueur est détecté
        if (this.isPlayerDetected && time - this.lastShootTime > 1000) {
            this.shootProjectile();
            this.lastShootTime = time;
        }

        // Mouvement horizontal de gauche à droite
        if (this.x >= this.startX + this.distance) {
            this.velocity = -Math.abs(this.velocity); // Inverser la vitesse pour aller vers la gauche
        } else if (this.x <= this.startX) {
            this.velocity = Math.abs(this.velocity); // Garder la vitesse positive pour aller vers la droite
        }

        this.setVelocityX(this.velocity); // Définir la vitesse de déplacement horizontal

    }
}
