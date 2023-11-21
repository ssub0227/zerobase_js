;
(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const getAll = (target) => {
    return document.querySelectorAll(target)
  }

  class Calculator {
    constructor(element) {
      this.element = element
      this.currentValue = ''
      this.prevValue = ''
      this.operation = null
    }

    appendNumber(number) {
      if (number == '.' && this.currentValue.includes('.')) return
      this.currentValue = this.currentValue.toString() + number.toString() // 숫자를 123 <- 123이라고 입력시 string 이 아니면 6이 됨
    }

    setOperation(operation) {
      this.resetOperation()
      this.operation = operation
      this.prevValue = this.currentValue
      this.currentValue = ''

      const elements = Array.from(getAll('.operation'))
      const element = elements.filter((element) => element.innerText.includes(operation))[0]
      element.classList.add('active')

    }

    updateDisplay() {
      if (this.currentValue) {
        this.element.value = this.currentValue
        return
      }
    }

    resetOperation() {
      this.operation = null
      const elements = Array.from(getAll('.operation'))
      elements.forEach((element) => {
        element.classList.remove('active')
      })
    }

    compute() {
      let computation
      const prev = parseFloat(this.prevValue)
      const current = parseFloat(this.currentValue)
      if (isNaN(prev) || isNaN(current)) return

      switch (this.operation) {
        case '+':
          computation = prev + current
          break
        case '-':
          computation = prev - current
          break
        case '*':
          computation = prev * current
          break
        case '÷':
          computation = prev / current
          break
        default:
          return
      }
      this.currentValue = computation.toString()
      this.prev = ''
      this.resetOperation()
    }
  }

  const numberButtons = getAll('.cell_button.number')
  const operationButtons = getAll('.cell_button.operation')
  const computeButton = get('.compute')
  const display = get('.display')

  const calculator = new Calculator(display)

  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    })
  })

  operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      calculator.setOperation(button.innerText)
      calculator.updateDisplay()
    })
  })

  computeButton.addEventListener('click', () => {
    calculator.compute()
    calculator.updateDisplay()
  })
})()