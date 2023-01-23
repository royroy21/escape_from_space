
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
require("@geckos.io/phaser-on-nodejs")
const Phaser = require("phaser")

class ServerScene extends Phaser.Scene {
  preload() {}
  create() {
    console.log("hits create here ...");
    io.on('connection', function (socket) {
      console.log('a user connected');
      socket.on('disconnect', function () {
        console.log('user disconnected');
      });
    });
  }
  update() {}
}

const config = {
  type: Phaser.HEADLESS,
  width: 1280,
  height: 720,
  banner: false,
  audio: false,
  scene: [ServerScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 }
    }
  }
}

new Phaser.Game(config)

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
