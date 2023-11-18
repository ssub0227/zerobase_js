;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }
  const cellCount = 6 // 전체 캐러셀 개수
  let selectIndex = 0 // 시작하는 아이템 순번
  const $prevButton = get('.prev_button')
  const $nextButton = get('.next_button')
  const $carousel = get('.carousel')

  const rotateCarousel = () =>{
    const angle = (selectIndex / cellCount ) * -360 // -360 곱하는 이유 : 캐러셀과 아이템은 각도의 부호가 반대로 나타나야 회전이 가능함
    $carousel.style.transform = `translateZ(-346px) rotateY(${angle}deg)`
  }
  
  $prevButton.addEventListener('click', () => {
    selectIndex--
    rotateCarousel()
  })

  $nextButton.addEventListener('click', () => {
    selectIndex++
    rotateCarousel()
  })
})()
