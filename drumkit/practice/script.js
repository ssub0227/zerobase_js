;(function () {
  'use strict'

  const get = function (target) {
    return document.querySelector(target)
  }

  const getAll = function (target) {
    return document.querySelectorAll(target)
  }

  const keys = Array.from(getAll('.key'))

  const soundsRoot = 'assets/sounds/'
  const drumSounds = [
    { key: 81, sound: 'clap.wav' },
    { key: 87, sound: 'crash.wav' },
    { key: 69, sound: 'hihat.wav' },
    { key: 65, sound: 'kick.wav' },
    { key: 83, sound: 'openhat.wav' },
    { key: 68, sound: 'ride.wav' },
    { key: 90, sound: 'shaker.wav' },
    { key: 88, sound: 'snare.wav' },
    { key: 67, sound: 'tom.wav' },
  ]

  const getAudioElement = (index) => {
    const audio = document.createElement('audio')
    audio.dataset.key = drumSounds[index].key
    audio.src = soundsRoot + drumSounds[index].sound

    return audio
  }

  const playSound = (keycode) => {
    const $audio = get(`audio[data-key="${keycode}"]`)
    const $key = get(`div[data-key="${keycode}"]`)
    if($audio && $key){ // $audio 와 $key가 존재하는 경우
      $audio.currendTime = 0
      $audio.play()
      $key.classList.add('playing')
    }
  }

  const onkeydown = (e) =>{
    playSound(e.keyCode)
  }

  const onmousedown = (e) =>{
    const keyCode = e.target.getAttribute('data-key')
    playSound(keyCode)
  }

  const ontransitionend = (e) =>{
    if(e.propertyName === 'transform'){ // transition 걸린 속성이 transform 인 경우
      e.target.classList.remove('playing')
    }
  }

  const init =() => {
    window.addEventListener('keydown', onkeydown)
    keys.forEach((key, index) => {
      const audio = getAudioElement(index)
      key.dataset.key = drumSounds[index].key
      key.appendChild(audio)
      key.addEventListener('click', onmousedown)
      key.addEventListener('transitionend', ontransitionend) //트렌지션이 끝났을 때 실행되는 함수
    })
  }

  init();
})()
