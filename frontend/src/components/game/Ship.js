import Phaser from "phaser";

export const createShip = (scene, config) => {
  const {
    x,
    y,
    key,
    frame,
    drag,
    angularDrag,
    maxVelocity,
    angularVelocity,
    velocityFromRotation,
    bounce,
    emitterConfig,
    shieldConfig,
    centerCamera,
  } = config;

  const ship = scene.physics.add.sprite(x, y, key, frame).setDepth(2);
  ship.setDrag(drag);
  ship.setAngularDrag(angularDrag);
  ship.setMaxVelocity(maxVelocity);
  ship.customAngularVelocity = angularVelocity;
  ship.customVelocityFromRotation = velocityFromRotation;
  ship.body.bounce.set(bounce);
  if (centerCamera) {
   scene.cameras.main.startFollow(ship);
  }
  ship.shieldStrength = shieldConfig.strength;
  ship.shieldConfig = shieldConfig;
  ship.customSize = Math.max(ship.height, ship.width);
  ship.destroyOnImpact = false;

  // TODO - this isn't working. Will have to sub class :/
  ship.getStrength = () => {
    if (ship.body.speed > 50) {
      return 1
    } else if (ship.body.speed > 250) {
      return 5
    } else {
      return 11
    }
  }
  createEmitter(scene, ship, emitterConfig);
  return ship
}

const createEmitter = (scene, ship, config) => {
  const {
    frame,
    speed,
  } = config

  const particles = scene.add.particles("space");
  scene.emitter = particles.createEmitter({
    frame: frame,
    speed: speed,
    lifespan: {
      onEmit: function (particle, key, t, value) {
        return Phaser.Math.Percent(ship.body.speed, 0, 300) * 2000;
      }
    },
    alpha: {
      onEmit: function (particle, key, t, value) {
        return Phaser.Math.Percent(ship.body.speed, 0, 300);
      }
    },
    angle: {
      onEmit: function (particle, key, t, value) {
        let v = Phaser.Math.Between(-10, 10);
        return (ship.angle - 180) + v;
      }
    },
    scale: { start: 0.6, end: 0 },
    blendMode: "ADD",
  });
  scene.emitter.startFollow(ship);
}

// Fades from white to red for each hit a shield takes.
const shieldColours = [
  0xff0000,
  0xff1919,
  0xff3232,
  0xff4c4c,
  0xff6666,
  0xff7f7f,
  0xff9999,
  0xffb2b2,
  0xffcccc,
  0xffe5e5,
  0xffffff,
]

export const computeProjectileHit = (projectile, ship) => {

  console.log("ship.body.speed: ", projectile.body.speed, projectile.getStrength());
  console.log("ship.shieldStrength: ", ship.shieldStrength);

  const scene = ship.scene;
  if (ship.shieldStrength > 0) {
    ship.shieldStrength = ship.shieldStrength - projectile.getStrength();
    if (projectile.destroyOnImpact) {
      projectile.destroy();
    }
    const shield = scene.add.circle(
      ship.x,
      ship.y,
      ship.customSize / 2 + 3,
      // TODO - should be calculated using percentages as
      // shield could be higher than for larger ships etc
      shieldColours[ship.shieldStrength],
      0.2,
    ).setDepth(3);
    const shieldTween = scene.tweens.add({
      targets: shield,
      alpha: 0,
      duration: 2000,
      ease: "Power2",
    });
    shieldTween.on("complete", shieldTween.remove)
  } else {
    scene.emitter.remove();
    ship.destroy();
    const explosion = scene.add.image(ship.x, ship.y, "space", "red").setDepth(3)
    const explosionTween = scene.tweens.add({
      targets: explosion,
      scaleX: 8,
      scaleY: 8,
      alpha: 0,
      duration: 1500,
      ease: "Bounce.easeInOut",
    });
    explosionTween.on("complete", explosionTween.remove);
  }
}
