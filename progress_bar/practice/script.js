;
(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  let timerId
  const trottle = (callback, time) => {
    if (timerId) return
    timerId = setTimeout(() => {
      callback()
      timerId = undefined
    }, time)
  }

  const $progressBar = get('.progress-bar')

  const onscroll = () => {
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrollTop = document.documentElement.scrollTop

    const width = (scrollTop / height) * 100

    $progressBar.style.width = width + '%'
  }
  window.addEventListener('scroll', () => trottle(onscroll, 100))
})()