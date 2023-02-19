let canvas = document.querySelector("canvas")
console.log(canvas)

let c = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let playerImageScale = 0.15
let playerSpeed = 3
let projSpeed = 10

class Player {
  constructor() {
    this.velocity = {
      x : 0,
      y : 0
    }
    this.image = new Image()
    this.image.src = "./assets/spaceship.png"
    this.width = this.image.width * playerImageScale
    this.height = this.image.height * playerImageScale

    this.position = {
      x : canvas.width/2 - this.width/2,
      y : canvas.height - this.height - 20
    }
    
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Projectile {
  constructor(position, velocity) {
    this.position = position
    this.velocity = velocity

    this.radius = 3
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = "red"
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

let player = new Player()
let projectiles = []
let keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  space: {
    pressed: false
  }
}


function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black"
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()

  for (let i=0; i<projectiles.length; i++) {
    let projectile = projectiles[i]
    projectile.update()
  }

  player.velocity.x = 0
  player.velocity.y = 0

  if (keys.a.pressed && player.position.x >=0) {
    player.velocity.x = -playerSpeed
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = playerSpeed
  } else if (keys.w.pressed && player.position.y >=0) {
    player.velocity.y = -playerSpeed
  } else if (keys.s.pressed && player.position.y + player.height <= canvas.height) {
    player.velocity.y = playerSpeed
  }
}

animate()

window.addEventListener('keydown', function(event) {
  console.log("keydown : ", event)
  switch (event.key) {
    case "a":
      console.log("left")
      // player.velocity.x = -playerSpeed
      keys.a.pressed = true
      break;
    case "d":
      console.log("right")
      // player.velocity.x = playerSpeed
      keys.d.pressed = true
      break;
    case "w":
      console.log("up")
      // player.velocity.y = -playerSpeed
      keys.w.pressed = true
      break;
    case "s":
      console.log("down")
      // player.velocity.x = playerSpeed
      keys.s.pressed = true
      break;
    case " ":
      console.log("space")
      keys.space.pressed = true
      let projectile = new Projectile(
        {
          x: player.position.x + player.width/2,
          y: player.position.y
        },
        {
          x: 0,
          y: -projSpeed
        }
      )
      projectiles.push(projectile)
      break
  }
})

window.addEventListener('keyup', function(event) {
  console.log("keyup : ", event)
  switch (event.key) {
    case "a":
      console.log("left")
      // player.velocity.x = -playerSpeed
      keys.a.pressed = false
      break;
    case "d":
      console.log("right")
      // player.velocity.x = playerSpeed
      keys.d.pressed = false
      break;
    case "w":
      console.log("up")
      // player.velocity.y = -playerSpeed
      keys.w.pressed = false
      break;
    case "s":
      console.log("down")
      // player.velocity.x = playerSpeed
      keys.s.pressed = false
      break;
    case " ":
      console.log("space")
      keys.space.pressed = false
      break
  }
})