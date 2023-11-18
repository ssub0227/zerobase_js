;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  class Stopwatch{
    constructor(element){
      this.timer = element
      this.interver = null
      this.defaultTime = '00:00.00'
      this.startTime = 0
      this.elapsedTime = 0
    }

    addZero(number){
      if(number < 10){
        return `0` + number
      } else if(number > 99){
        return number.toString().slice(0, -1)
      }
      return number
    }

    timeToString(time){ // 밀리세컨즈를 시간으로 변환
      const date = new Date(time)
      const minutes = date.getUTCMinutes()
      const seconds = date.getUTCSeconds()
      const milliSeconds = date.getUTCMilliseconds()
      return `${this.addZero(minutes)}:${this.addZero(seconds)}.${this.addZero(milliSeconds)}`
    }

    print(text){
      this.timer.innerHTML = text
    }

    startTimer(){
      this.elapsedTime = Date.now() - this.startTime
      const time = this.timeToString(this.elapsedTime)
      this.print(time)
    }

    start(){
      clearInterval(this.interver) // 스타트를 누를 때마다 진행되고 있는 인터벌을 없애줘야 함
      this.startTime = Date.now() - this.elapsedTime
      this.interver = setInterval(this.startTimer.bind(this), 10) // class 안에 있는 this사용을 위해 바인딩
    }
    stop(){
      clearInterval(this.interver)
    }
    reset(){}
  }
  const $startButton = get('.timer_button.start')
  const $stopButton = get('.timer_button.stop')
  const $resetButton = get('.timer_button.reset')
  const $timer = get('.timer')
  const stopWatch = new Stopwatch($timer)
  
  $startButton.addEventListener('click', ()=> stopWatch.start())
  $stopButton.addEventListener('click', () => stopWatch.stop())
})()
