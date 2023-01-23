
const cursorUpdates = (scene, cursors, ship) => {
  if (cursors.left.isDown) {
    ship.setAngularVelocity(-ship.customAngularVelocity);
  }
  else if (cursors.right.isDown) {
    ship.setAngularVelocity(ship.customAngularVelocity);
  }
  else {
    ship.setAngularVelocity(0);
  }
  if (cursors.up.isDown) {
    scene.physics.velocityFromRotation(
      ship.rotation,
      ship.customVelocityFromRotation,
      ship.body.acceleration,
    );
  }
  else {
    ship.setAcceleration(0);
  }
}

export default cursorUpdates;
