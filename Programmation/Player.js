export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,) {
        super(scene, x, y, );

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setTexture("perso")
        this.body.allowGravity = false

        this.setSize(32, 32)
        this.setOffset(0, 0);

        this.cursors = this.scene.input.keyboard.createCursorKeys();


       

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }


    update() {
       


    }
}
