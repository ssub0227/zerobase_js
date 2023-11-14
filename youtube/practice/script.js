;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)
  const getAll = (target) => document.querySelectorAll(target)

  const $search = get('#search')
  const $list = getAll('.contents.list figure')
  const $searchButton = get('.btn_search')
  
  const $player = get('.view video')
  const $btnPlay = get('.js-play')
  const $btnReplay = get('.js-replay')
  const $btnStop = get('.js-stop')
  const $btnMute = get('.js-mute')
  const $progress = get('.js-progress')
  const $volume = get('.js-volume')
  const $fullScreen = get('.js-fullScreen')

  const init = () => {
    $search.addEventListener('keyup', search)
    $searchButton.addEventListener('click', search)
    
    for(let index = 0; index < $list.length; index ++){
      const $target = $list[index].querySelector('picture')
      $target.addEventListener('mouseover', onMouseOver)
      $target.addEventListener('mouseout', onMouseOut)
      $list[index].addEventListener('click', hashChange)
    }

    window.addEventListener('hashchange', ()=>{
      const isView = -1 < window.location.hash.indexOf('view')
      if(isView){
        getViewPage()
      } else{
        getListPage()
      }
    })

    viewPageEvent()
  }

  const onMouseOver = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source') // parentNode : 마우스한 요소가 img나 source 이기 때문에 
    webpPlay.setAttribute('srcset', './assets/sample.webp')
  }

  const onMouseOut = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source') 
    webpPlay.setAttribute('srcset', './assets/sample.jpg')
  }

  const search = () =>{
    let searchText = $search.value.toLowerCase()
    for(let index = 0; index < $list.length; index ++){
      const $target = $list[index].querySelector('strong')
      const text = $target.textContent.toLowerCase()

      if(-1 < text.indexOf(searchText)) { // 제목에 검색한 내용이 있다면 그 글자의 index가 출력됨 -> 0부터 시작
        $list[index].style.display = 'flex'
      } else {
        $list[index].style.display = 'none'
      }
    }
  }

  const hashChange = (e) => {
    e.preventDefault() //hashChange는 요소가 클릭되면 실행되기 때문에 a 태그의 기본 기능을 없앰 
    const parentNode = e.target.closest('figure')
    const viewTitle = parentNode.querySelector('strong').textContent
    window.location.hash = `view&${viewTitle}`
  }

  
  const getViewPage = () => {
    const $viewTitle = get('.view strong')
    const urlTitle = decodeURI(window.location.hash.split('&')[1]) // &문자가 이스케이핑 처리 된 것을 decodeURI로 다시 되돌림
    $viewTitle.innerText = urlTitle

    get('.list').style.display = 'none'
    get('.view').style.display = 'flex'
  }

  const getListPage  = () => {
    get('.list').style.display = 'flex'
    get('.view').style.display = 'none'
  }

  const buttonChange = (btn, value) => {
    btn.innerHTML = value
  }

  const viewPageEvent = () => {
    $volume.addEventListener('change', (e)=>{
      $player.volume = e.target.value
    })

    $player.addEventListener('timeupdate', setProgress)
    $player.addEventListener('play', buttonChange($btnPlay, 'pause'))
    $player.addEventListener('pause', buttonChange($btnPlay, 'play'))
    $player.addEventListener('volumeChange', () => {
      $player.muted ? buttonChange($btnMute, 'unmute') : buttonChange($btnMute, 'mute')
    })
    $player.addEventListener('ended', $player.pause())
    $progress.addEventListener('click', getCurrent)
    $btnPlay.addEventListener('click', playVideo)
    $btnStop.addEventListener('click', stopVideo)
    $btnReplay.addEventListener('click', replayVideo)
    $btnMute.addEventListener('click', mute)
    $fullScreen.addEventListener('click', fullScreen)
  }

  const getCurrent = (e) => {
    let percent = e.offsetX / $progress.offsetWidth // 전체 프로그래스 바 넓이에서 내가 클릭한 곳의 위치를 계산해서 퍼센트로
    $player.currentTime = percent * $player.duration // video api 사용
    e.target.value = Math.floor(percent / 100)
  }

  const setProgress = () => {
    let percentage = Math.floor((100 / $player.duration) * $player.currentTime)
    $progress.vaule = percentage
  }

  const playVideo = () => {
    if($player.paused || $player.ended){
      buttonChange($btnPlay, 'pause')
      $player.play()
    } else {
      buttonChange($btnPlay, 'play')
      $player.pause()
    }
  }

  const stopVideo = () => {
    $player.pause()
    $player.currentTIme = 0
    buttonChange($btnPlay, 'play')
  }

  const resetPlayer = () => {
    $progress.value = 0
    $player.currentTIme = 0
  }

  const replayVideo = () => {
    resetPlayer()
    $player.play()
    buttonChange($btnPlay, 'pause')
  }

  const mute = () => {
    if($player.muted){
      buttonChange($btnMute, 'mute')
      $player.muted = false
    } else{
      buttonChange($btnMute, 'unmute')
      $player.muted = true
    }
  }

  const fullScreen = () =>{
    if($player.requestFullscreen){
      if(document.fullscreenElement){
        document.cancelFullscreen()
      } else {
        $player.requestFullscreen()
      }
    } else if ($player.msRequestFullScreen){ //ms
      if(document.msRequestFullScreen){
        document.msExitFullscreen()
      } else {
        $player.msRequestFullScreen()
      }
    }
  }
  init()
})()
