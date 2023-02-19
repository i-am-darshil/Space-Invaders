let canvas = document.querySelector("canvas")
console.log(canvas)

let c = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let scoreEl = document.getElementById('score')
let score = 0

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

    this.radius = 4
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

class Particle {
  constructor(position, velocity, radius, color) {
    this.position = position
    this.velocity = velocity

    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class InvaderProjectile {
  constructor(position, velocity) {
    this.position = position
    this.velocity = velocity
    this.width = 3
    this.height = 10
  }

  draw() {
    c.fillStyle = "lavender"
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
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

  update(velocity) {
    this.draw()
    this.position.x += velocity.x
    this.position.y += velocity.y
  }

  shoot(invaderProjectiles) {
    let invaderProjectile = new InvaderProjectile(
      {
        x: this.position.x + this.width/2,
        y: this.position.y + this.height
      }, 
      {
        x: 0,
        y: 2
      }
    )
    invaderProjectiles.push(invaderProjectile)
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 2,
      y: 0
    }
    this.invaders = []

    let columns = Math.floor(Math.random() * 10) + 5
    let rows = Math.floor(Math.random() * 5) + 2

    this.width = columns * invaderWidth

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
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = - this.velocity.x
      this.velocity.y = invaderHeight
    }
  }
}

let player = new Player()
let projectiles = []
let invaderProjectiles = []
let grids = []
let particles = []
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
let frames = 0
let frameInterval = 1000
let invaderProjectileInterval = 100

for (let i=0; i<150; i++) {
  let particle = new Particle(
    {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    },
    {
      x: 0,
      y: 0.3
    },
    Math.random() * 2,
    "white"
  )
  particles.push(particle)
}

let gameOver = false

function animate() {
  if (gameOver) return
  window.requestAnimationFrame(animate)
  c.fillStyle = "black"
  c.fillRect(0, 0, canvas.width, canvas.height)

  player.update()

  for (let i=particles.length-1; i>=0; i--) {
    let particle = particles[i]
    if (particle.position.y >= canvas.width) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = 0
    }
    particle.update()
  }

  for (let i=invaderProjectiles.length-1; i>=0; i--) {
    let invaderProjectile = invaderProjectiles[i]
    if (invaderProjectile.position.y >= canvas.height) {
      invaderProjectiles.splice(i, 1)
    } else {
      invaderProjectile.update()
    }

    let projTop = invaderProjectile.position.y
    let projBottom = invaderProjectile.position.y + invaderProjectile.height
    let projRight = invaderProjectile.position.x + invaderProjectile.width
    let projLeft = invaderProjectile.position.x


    let playerBottom = player.position.y + player.height
    let playerTop = player.position.y
    let playerLeft = player.position.x
    let playerRight = player.position.x + player.width

    if (
      projTop <= playerBottom &&
      projBottom >= playerTop &&
      projRight >= playerLeft &&
      projLeft <= playerRight
      ) {
        console.log("You Lose")
        window.setTimeout(() => {
          gameOver = true
        }, 50)
      }
  }

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
    let invaders = grid.invaders
    grid.update()

    if (frames % invaderProjectileInterval == 0 && invaders.length > 0) {
      let randomInvaderPosition = Math.floor(Math.random() * invaders.length)
      let randomInvader = invaders[randomInvaderPosition]
      randomInvader.shoot(invaderProjectiles)
    }

    for (let j=invaders.length-1; j>=0; j--) {
      let invader = invaders[j]
      invader.update(grid.velocity)

      let playerBottom = player.position.y + player.height
      let playerTop = player.position.y
      let playerLeft = player.position.x
      let playerRight = player.position.x + player.width

      let invaderBottom = invader.position.y + invader.height
      let invaderTop = invader.position.y
      let invaderLeft = invader.position.x
      let invaderRight = invader.position.x + invader.width

      if (
        playerTop <= invaderBottom &&
        playerBottom >= invaderTop &&
        playerRight >= invaderLeft &&
        playerLeft <= invaderRight
        ) {
          console.log("You Lose")
          window.setTimeout(() => {
            gameOver = true
          }, 50)
        }

      for (let p=projectiles.length-1; p>=0; p--) {
        let projectile = projectiles[p]
        let projTop = projectile.position.y - projectile.radius
        let projBottom = projectile.position.y + projectile.radius
        let projRight = projectile.position.x + projectile.radius
        let projLeft = projectile.position.x - projectile.radius

        // console.log(projectile, projTop, invaderBottom)
        if (
          projTop <= invaderBottom &&
          projBottom >= invaderTop &&
          projRight >= invaderLeft &&
          projLeft <= invaderRight
          ) {
          console.log("Hit")
          invaders.splice(j, 1)
          projectiles.splice(p, 1)
          
          score += 1
          scoreEl.innerHTML = score

          if (invaders.length > 0) {
            let firstInvader = invaders[0]
            // The grids are created in cloumnar format. The colummns are filled first and then to another row. Thus lastInvader should give the accurate right position of grid
            let lastInvader = invaders[invaders.length - 1]

            grid.width = (lastInvader.position.x + lastInvader.width) - firstInvader.position.x
            grid.position.x = firstInvader.position.x
          } else {
            grids.splice(i, 1)
          }

        }
      }
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

  if (frames % frameInterval == 0) {
    grids.push(new Grid())
    frames = 0
  }
  frames++
}

animate()

window.addEventListener('keydown', function(event) {
  if (gameOver) return
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