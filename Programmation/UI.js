export class Health extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,) {
        super(scene, x, y, );

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setTexture("barredevie")
        this.body.allowGravity = false

        this.setSize(200, 200)
        this.setOffset(0, 0);



       

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }


    update() {
       


    }
}
