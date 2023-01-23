// Inspired by https://phaser.io/examples/v3/view/physics/arcade/space

import Phaser from "phaser";
import Bullet from "./Bullet";
import cursorUpdates from "./Cursor";
import {computeProjectileHit, createShip} from "./Ship";
import {io} from "socket.io-client";

// TODO - this should come from User via backend
const defaultShipConfig = {
  x: 200,
  y: 200,
  key: "space",
  frame: "ship",
  drag: 300,
  angularDrag: 400,
  maxVelocity: 600,
  angularVelocity: 150,
  velocityFromRotation: 600,
  bounce: 0.5,
  emitterConfig: {frame: "blue", speed: 100},
  shieldConfig: {strength: 10},
  centerCamera: true,
}

const enemyShipConfig = {
  ...defaultShipConfig,
  x: 300,
  y: 300,
  centerCamera: false,
}

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.lastFired = 0;
  }

  preload() {
    this.load.image("background", "assets/nebula.jpg");
    this.load.atlas(
      "space",
      "assets/space.png",
      "assets/space.json",
    );
  }

  create() {
    this.socket = io.connect("http://localhost:8081");
    // this.socket = io("localhost:8081");
    this.bg = this.add.tileSprite(
      400,
      300,
      2800,
      2600,
      "background",
    ).setScrollFactor(0);
    this.ship = createShip(this, defaultShipConfig);
    console.log("ship: ", this.ship);
    this.bullets = this.physics.add.group({
        classType: Bullet,
        // maxSize: 5,   // limits bullets
        // runChildUpdate: true
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // TODO - remove this. Adding second ship for physics demo.
    this.enemyShips = this.add.group();
    const enemyShip = createShip(this, enemyShipConfig);
    this.enemyShips.add(enemyShip);
    this.physics.add.collider(this.ship, this.enemyShips, computeProjectileHit);
  }

  update(time, delta) {
    cursorUpdates(this, this.cursors, this.ship)

    if (this.fire.isDown && time > this.lastFired) {
      let bullet = this.bullets.get();
      if (bullet) {
        this.physics.add.overlap(
          bullet,
          this.enemyShips,
          computeProjectileHit,
        );
        bullet.fire(this.ship);
        this.lastFired = time + 100;
      }
    }
    this.bg.tilePositionX += this.ship.body.deltaX() * 0.1;
    this.bg.tilePositionY += this.ship.body.deltaY() * 0.1;
  }
}

export default MainScene;
