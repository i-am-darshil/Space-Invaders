let canvas = document.querySelector("canvas")
console.log(canvas)

let c = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let playerImageScale = 0.15
let playerSpeed = 3
let projSpeed = 10
let invaderImageScale = 1
let invaderWidth = 30
let invaderHeight = 30

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

class Invader {
  constructor(position) {
    this.velocity = {
      x : 0,
      y : 0
    }
    this.image = new Image()
    this.image.src = "./assets/invader.png"
    this.width = this.image.width * invaderImageScale
    this.height = this.image.height * invaderImageScale

    this.position = {
      x : position.x,
      y : position.y
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

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.invaders = []

    let columns = Math.floor(Math.random() * 10) + 5
    let rows = Math.floor(Math.random() * 5) + 2

    for (let i=0; i<columns; i++) {
      for (let j=0; j<rows; j++) {

        let invaderX = i * invaderWidth
        let invaderY = j * invaderHeight

        let invader = new Invader({
          x: invaderX,
          y: invaderY
        })
        this.invaders.push(invader)
      }
    }
  }

  update() {

  }
}

let player = new Player()
let projectiles = []
let grids = [new Grid()]
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

  for (let i=projectiles.length-1; i>=0; i--) {
    let projectile = projectiles[i]
    if (projectile.position.y <= 0) {
      projectiles.splice(i, 1)
    } else {
      projectile.update()
    }
  }

  for (let i=grids.length-1; i>=0; i--) {
    let grid = grids[i]
    grid.update()
    for (let j=grid.invaders.length-1; j>=0; j--) {
      let invader = grid.invaders[j]
      invader.update()
    }
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
  switch (event.key) {
    case "a":
      keys.a.pressed = true
      break;
    case "d":
      keys.d.pressed = true
      break;
    case "w":
      keys.w.pressed = true
      break;
    case "s":
      keys.s.pressed = true
      break;
    case " ":
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
      console.log(projectiles)
      break
  }
})

window.addEventListener('keyup', function(event) {
  switch (event.key) {
    case "a":
      keys.a.pressed = false
      break;
    case "d":
      keys.d.pressed = false
      break;
    case "w":
      keys.w.pressed = false
      break;
    case "s":
      keys.s.pressed = false
      break;
    case " ":
      keys.space.pressed = false
      break
  }
})