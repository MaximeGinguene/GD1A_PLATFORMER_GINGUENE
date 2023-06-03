export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.initPlayer(); // c'est comme un create
    }

    initPlayer() {
        this.setGravity(0, GRAVITY);
        this.setMaxVelocity(XSPEED, YSPEED);
        this.setSize(8, 16);
        this.setOffset(12, 8);

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.alive = true;
        this.hp = 10;
        // etc etc
    }

    Update() {






    }
}


