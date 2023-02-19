let canvas = document.querySelector("canvas")
console.log(canvas)

let c = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
  constructor() {
    this.position = {
      x : 200,
      y : 200
    }
    this.velocity = {
      x : 0,
      y : 0
    }
    this.image = new Image()
    this.image.src = "./assets/spaceship.png"
    this.width = 100
    this.height = 100
  }


  draw() {
    // c.fillStyle = "red"
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

let player = new Player()
// While drawing images of KB's in size, it might take some time to load the image. Hence, just drawing once at the start might give us a white screen
player.draw()