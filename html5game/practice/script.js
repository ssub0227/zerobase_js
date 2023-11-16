;
(function () {
  'use strict'

  const get = (target) => document.querySelector(target)

  const $canvas = get('.canvas')
  const ctx = $canvas.getContext('2d')
  const $score = get('.score')
  const $highscore = get('.highscore')
  const $play = get('.js-play') // 이벤트가 들어가는 요소일 경우 js- 추가하는 방법도 좋다.

  const colorSet = {
    board: 'rgb(20, 105, 28)',
    snakeHead: 'rgba(229, 65, 120, 0.929)',
    snakeBody: 'rgba(153, 206, 244, 0.498)',
    food: 'rgb(66,187,103)',
  }

  let start = 0
  let option = {
    highscore: localStorage.getItem('score') || 0,
    gameEnd: true,
    direction: 2,
    snake: [{
        x: 10,
        y: 10,
        direction: 2
      },
      {
        x: 10,
        y: 20,
        direction: 2
      },
      {
        x: 10,
        y: 30,
        direction: 2
      }, // 뱀의 몸이 ㅁㅁㅁ 형식이라 -> option.snake.length = 뱀의 길이
    ],
    food: {
      x: 0,
      y: 0
    }, // food의 초기화 
    score: 0
  }

  const init = () => {
    document.addEventListener('keydown', (event) => {
      if (!/Arrow/gi.test(event.key)) { // 정규식 - Arrow문자가 event.key에 포함되어있는지 대소문자 상관 없이 검사 
        return //방향키가 아니라면 return
      }

      event.preventDefault()
      const direction = getDirection(event.key)
      if (!isDirectionCorrect(direction)) {
        return
      }
      option.direction = direction
    })

    $play.onclick = () => {
      if (option.gameEnd) { // 게임이 끝났으면 option 초기화
        option = {
          highscore: localStorage.getItem('score') || 0,
          gameEnd: false,
          direction: 2,
          snake: [{
              x: 10,
              y: 10,
              direction: 2
            },
            {
              x: 10,
              y: 20,
              direction: 2
            },
            {
              x: 10,
              y: 30,
              direction: 2
            },
          ],
          food: {
            x: 0,
            y: 0
          },
          score: 0
        }
        $score.innerHTML = `점수: 0점 `
        $highscore.innerHTML = `최고 점수: ${option.highscore}점 `
        randomFood()
        window.requestAnimationFrame(play) // 애니메이션 렌더링 최적화 -> 지렁이가 움직일 때 셋인터벌로 했을 때보다 프레임이 자연스럽다
      }
    }
  }

  const buildBorad = () => {
    ctx.fillStyle = colorSet.board //fillStyle - 색상을 채워줌 
    ctx.fillRect(0, 0, 300, 300) // 캔버스 내에서 (0,0) 부터(300,300- width, height) 까지 
  }

  const buildSnake = (ctx, x, y, head = false) => {
    ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody
    ctx.fillRect(x, y, 10, 10) // 지렁이 사각형은 10픽셀 고정
  }


  const buildFood = (ctx, x, y) => {
    ctx.beginPath()
    ctx.fillStyle = colorSet.food
    ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI) // 원 생성 
    ctx.fill() // 색상 채움
  }

  const setSnake = () => {
    for (let i = option.snake.length - 1; i >= 0; --i) { // i가 뒤에서부터 줄어들게 
      buildSnake(ctx, option.snake[i].x, option.snake[i].y, i === 0) // 순서가 0 = head, 
    }
  }

  const setHighScore = () =>{
    const localScore = option.highscore * 1 || 0 // 숫자 형변환을 위해 * 1 
    const finalScore = $score.textContent.match(/(\d+)/)[0] * 1 //정규식 숫자 필터링
    if(localScore < finalScore){
      alert(`최고기록 : ${localScore}`)
      localStorage.setItem('score', finalScore)
    }
  }
  const setDirection = (number, value) => {
    while (value < 0) {
      value += number // number(300) 보다 value 값이 작으면 300을 더해줘서 프레임 안으로 다시 들어오게 
    }

    return value % number
  }

  const setBody = () => {
    const tail = option.snake[option.snake.length - 1]
    const direction = tail.direction // 마지막 꼬리의 디렉션
    let x = tail.x
    let y = tail.y

    switch (direction) {
      case 1: // down
        y = setDirection(300, y - 10)
        break
      case -1: //up
        y = setDirection(300, y + 10)
        break
      case 2: //right
        x = setDirection(300, x - 10)
        break
      case -2: //left
        x = setDirection(300, x + 10)
        break
    }
    option.snake.push(x, y, direction) //option.snake 에 새로 추가
  }

  const getFood = () => {
    const snakeX = option.snake[0].x
    const snakeY = option.snake[0].y
    const foodX = option.food.x
    const foodY = option.food.y
    if (snakeX === foodX && snakeY === foodY) {
      option.score++
      $score.innerHTML = `점수: ${option.score}점`
      setBody()
      randomFood()
    }
  }

  const randomFood = () => {
    let x = Math.floor(Math.random() * 25) * 10 //25 -> 300캔버스 내의 250 정도의 영역에서 랜덤하게 생성되게
    let y = Math.floor(Math.random() * 25) * 10
    while (option.snake.some((part) => {
        part.x === x && part.y === y
      })) { // part.x,y-> 뱀의 위치, 뱀의 위치랑 랜덤푸드가 동일하면 게임 시작하자마자 먹이 먹으면 안되니까
      x = Math.floor(Math.random() * 25) * 10
      y = Math.floor(Math.random() * 25) * 10
    }

    option.food = {
      x,
      y
    }
  }

  const playSnake = () =>{
    let x = option.snake[0].x
    let y = option.snake[0].y
    switch(option.direction){
      case 1: // down
        y = setDirection(300, y + 10)
        break
      case -1: //up
        y = setDirection(300, y - 10)
        break
      case 2: //right
        x = setDirection(300, x + 10)
        break
      case -2: //left
        x = setDirection(300, x - 10)
        break
    }
    const snake = [{x,y,direction: option.direction}]
    const snakeLength = option.snake.length
    for (let i =1; i<snakeLength;++i){
      snake.push({ ...option.snake[i-1] })
    } 

    option.snake = snake
  }

  const getDirection = (key) => {
    let direction = 0
    switch (key) {
      case 'ArrowDown':
        direction = 1
        break
      case 'ArrowUp':
        direction = -1
        break
      case 'ArrowLeft':
        direction = -2
        break
      case 'ArrowRight':
        direction = 2
        break
    }

    return direction
  }

  const isDirectionCorrect = (direction) => { // 디렉션을 반대로 바꾸는 걸 막기 위해
    return (option.direction === option.snake[0].direction && option.direction !== -direction) // -direction 이 반대방향 처리
  }

  const isGameOver = () =>{
    const head = option.snake[0]
    return option.snake.some(
      (body,index) => index !== 0 && head.x === body.x && head.y === body.y
    )
  }

  const play = (timestamp) => {
    start++
    if (option.gameEnd) {
      return
    }
    if (timestamp - start > 1000 / 10) {
      if (isGameOver()) {
        option.gameEnd = true
        setHighScore()
        alert('게임오버')
        return
      }
      playSnake()
      buildBorad()
      buildFood(ctx, option.food.x, option.food.y)
      setSnake()
      getFood()
      start = timestamp
    }
    window.requestAnimationFrame(play) // 재귀적으로 호출 
  }
  init()
})()