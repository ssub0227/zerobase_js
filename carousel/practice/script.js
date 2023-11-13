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
    }
  }

   
  document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = get('.carousel')
    const carousel = Carousel(carouselElement)


  })
})()
