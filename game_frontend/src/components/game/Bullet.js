import Phaser from "phaser";

class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, "space", "blaster");
    this.setBlendMode(1);
    this.setDepth(1);
    this.speed = 500;
    this.strength = 1;
    this.destroyOnImpact = true;

    // TODO - currently doesn't seem to do much.
    // Good idea for bullets should have a limited lifespan.
    // this.lifespan = 200;
  }

  fire = (ship) => {
    this.setActive(true);
    this.setVisible(true);
    this.setAngle(ship.body.rotation);
    this.setPosition(ship.x, ship.y);
    this.body.reset(ship.x, ship.y);
    let angle = Phaser.Math.DegToRad(ship.body.rotation);
    this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
    this.body.velocity.x *= 2;
    this.body.velocity.y *= 2;
  }

  getStrength = () => {
    return this.strength;
  }

  // update(args) {
  //   this.lifespan -= args.delta;
  //   if (this.lifespan <= 0)
  //   {
  //     this.setActive(false);
  //     this.setVisible(false);
  //     this.body.stop();
  //   }
  // }
}

export default Bullet;
