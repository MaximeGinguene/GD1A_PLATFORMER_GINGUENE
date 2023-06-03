export class Rock extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'box');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(64, 64)
            .setOffset(0, 0)
            .setImmovable(true);

        this.player = scene.player; // Assurez-vous d'avoir une référence à l'objet "player" dans votre scène principale et de la passer à la classe Rock.

        // Ajoutez les touches de saisie et de lâcher à la scène principale plutôt qu'à la classe Rock.
        this.toucheA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.isAgrippantBox = false;
        this.isCameraShaking = false;

        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    agripperBox() {
        if (!this.player.cantmove && !this.isAgrippantBox) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.x, this.y);
            if (distance < 100) {
                this.isAgrippantBox = true;
                this.scene.cameras.main.shake(200, 0.005);
                this.isCameraShaking = true;
            }
        }
    }

    lacherBox() {
        if (this.isAgrippantBox) {
            this.isAgrippantBox = false;
            this.setVelocityX(0);
            this.isCameraShaking = false;
        }
    }

    update() {
        if (this.player.cantmove) return;

        if (this.isCameraShaking) {
            this.scene.cameras.main.shake(400, 0.001);
        }

        if (this.isAgrippantBox) {
            if (this.player.body.blocked.down && this.scene.cursors.up.isDown) {
                this.player.setVelocityY(-200);
            }
            if (this.player.body.blocked.right && this.scene.cursors.up.isDown) {
                this.player.setVelocityY(-200);
            }
            if (this.player.body.blocked.left && this.scene.cursors.up.isDown) {
                this.player.setVelocityY(-200);
            }
        }

        if (this.isAgrippantBox) {
            if (this.player.body.blocked.right) {
                this.setVelocityX(120);
            }
            if (this.player.body.blocked.left) {
                this.setVelocityX(-120);
            }
        }
    }
}
