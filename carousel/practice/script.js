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
      this.prevButton = this.carouselElement.querySelector('.carousel_button--prev')
      this.nextButton = this.carouselElement.querySelector('.carousel_button--next')

      this.prevButton.addEventListener('click', () => {
        this.movePrev()
      })

      this.nextButton.addEventListener('click', () => {
        this.moveNext()
      })
    }

    initCarousel(){
      this.items[0].classList.add('active')
      this.items[1].classList.add('next')
      this.items[this.totalItems -1 ].classList.add('prev')
    }
     
    moveCarouselTo(){
      let prev = this.current - 1
      let next = this.current + 1

      if (this.current === 0){
        prev = this.totalItems -1 // 현재가 0이면 prev 은 마지막에 와야 함
      } else if (this.current === this.totalItems -1){
        next = 0 // 현재가 가장 마지막이면 next 는 0이 와야 함
      }

      for (let i= 0 ; i <this.totalItems; i ++){
        if(i === this.current){
          this.items[i].className = this.itemClassName + ' active'
        } else if (i === prev){
          this.items[i].className = this.itemClassName + ' prev'
        } else if (i === next){
          this.items[i].className = this.itemClassName + ' next'
        } else {
          this.items[i].className = this.itemClassName 
        }
      }
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
    const carousel = new Carousel(carouselElement)

    carousel.initCarousel()
    carousel.setEventListener()
  })
})()
