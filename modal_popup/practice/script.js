;(function () {
  'use strict'
  const get = (target) => {
    return document.querySelector(target)
  }

  const $button = get('.modal_open_button')
  const $body = get('body')
  const $modal = get('.modal')
  const $modalCancleButton = get('.cancel')
  const $modalConfirmButton = get('.confirm')

  const toggleModal = () => {
    $body.classList.toggle('scroll_lick')
    $modal.classList.toggle('show')
  }

  $button.addEventListener('click', toggleModal)
  $modalCancleButton.addEventListener('click', toggleModal)
  $modalConfirmButton.addEventListener('click', toggleModal)
  window.addEventListener('click', (e)=>{
    if(e.target === $modal){
      toggleModal()
    }
  })
})()
