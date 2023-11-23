;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)

  class BrickBreak {
    constructor(parent ='body', data = {}){
      this.parent = get(parent)
      this.canvas = document.createElement('canvas')
      this.canvas.setAttribute('width', 480)
      this.canvas.setAttribute('height', 340)
      this.ctx = this.canvas.getContext('2d')
      this.fontFamily = `20px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
      this.score = 0
      this.lives = data.lives,
      this.speed = data.speed,
      this.image = document.createElement('img'),
      this.bg = data.bg,
      this.radius = 10,
      this.ballX = this.canvas.width/2,
      this.ballY = this.canvas.height - 30,
      this.directX = data.speed,
      this.directY = data.speed,
      this.paddleWidth = data.paddleWidth,
      this.paddleHeight = data.paddleHeight,
      this.rightPressed = false,
      this.leftPressed = false,
      this.paddleX = (this.canvas.width - this.paddleWidth) / 2
      this.brickRow = data.brickRow
      this.brickCol = data.brickCol
      this.brickWidth = data.brickWidth
      this.brickHeight = data.brickHeight
      this.brickPad = data.brickPad
      this.brickPosX = data.brickPosX
      this.brickPosY = data.brickPosY
      this.ballColor = data.ballColor
      this.paddleColor = data.paddleColor
      this.fontColor = data.fontColor
      this.brickStartColor = data.brickStartColor
      this.brickEndColor = data.brickEndColor
      this.image.setAttribute('src', this.bg)
      this.parent.appendChild(this.canvas)
      this.bricks = []
    }

    init = () =>{
      for (let colIndex =0; colIndex < this.brickCol; colIndex++){
        this.bricks[colIndex] = []
        for  (let rowIndex =0; rowIndex < this.brickRow; rowIndex++){
          this.bricks[colIndex][rowIndex] = {x :0, y:0, status: 1}
        }
      }

      // this.keyEvent()
      this.draw()
    }

    draw = () => {
      this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)

      this.ctx.drawImage(
        this.image, 
        this.canvas.width / 2 - this.image.width /2,
        this.canvas.height / 2 - this.image.height /2,
      )

      this.drawBall()
      this.drawpaddle()
      this.drawBricks()
      this.drawScore()
      this.drawLives()
      this.detectCollision()
    }
  }


  const data = {
    lives: 5,
    speed: 0,
    paddleHeight: 10,
    paddleWidth: 25,
    bg: `./assets/bg.jpeg`,
    ballColor: '#04bf55',
    paddleColor: '#05aff2',
    fontColor: '#f2bb16',
    brickStartColor: '#f29f05',
    brickEndColor: '#f21905',
    brickRow: 3,
    brickCol:5,
    brickWidth: 75,
    brickHeight:20,
    brickPad: 10,
    brickPosX:30,
    brickPosY: 10
  }

  const brickBreak = new BrickBreak('.canvas', data)
  BrickBreak.init()
})()
