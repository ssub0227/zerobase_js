;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  class Carousel{
    constructor(carouselElement) {
      this.carouselElement = carouselElement
      this.itemClassName = 'carousel_item'
      this.items = this.carouselElement.querySelectorAll('.carousel_item') // .carousel 밑에 있는 .carousel_item 를 items 로 연결 -> 유사배열객체로 넘어옴
      this.totalItems = this.items.length
      this.current = 0
    }

    setEventListener(){
      this.prevButton = this.carouselElement.querySelector('carousel_button--prev')
      this.nextButton = this.carouselElement.querySelector('carousel_button--next')

      this.nextButton.addEventListener('click', () => {
        this.movePrev()
      })

      this.prevButton.addEventListener('click', () => {
        this.moveNext()
      })
    }

    movePrev(){
      if(this.current === 0){
        this.current = this.totalItems - 1  //current 가 0일 경우 마지막 숫자로 변경
      } else {
        this.current --
      }
      this.moveCarouselTo()
    }

    moveNext(){
      if(this.current === this.totalItems - 1){
        this.current = 0  //current 가 마지막일 경우에 moveNext() 호출시 current 를 0으로 변경
      } else {
        this.current ++
      }
      this.moveCarouselTo()
    }
  }

   
  document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = get('.carousel')
    const carousel = Carousel(carouselElement)


  })
})()
