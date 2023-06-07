export class Memories extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, imageKey, imageX, imageY) {
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.closeKey = scene.input.keyboard.addKeys(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.imageX = imageX;
        this.imageY = imageY;
        this.camera = scene.cameras.main;

        //Faire en sorte que l'image s'affiche par rapport à la caméra et non le collectible.

        this.image = scene.add.image(this.camera.scrollX + this.camera.width / 2 + imageX, this.camera.scrollY + this.camera.height / 2 + imageY, imageKey)
            .setVisible(false)
            .setDepth(1500);

        this.visionBox = this.scene.physics.add.sprite(375, 1312, 'SouvenirImage').setVisible(false);
        this.visionBox.body.allowGravity = false;
        this.visionBox.setSize(38, 38);

        this.setSize(32, 32);
        this.setOffset(0, 0);

        this.setTexture("SouvenirImage");

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.code === "Space" && this.image.visible) {
                this.destroy();
            }
        });
    }

    update() {
    
        this.visionBox.x = this.x;
        this.visionBox.y = this.y;

    }

    destroy() {
   
        this.visionBox.destroy();
        this.image.destroy();
        super.destroy();
    }
}
