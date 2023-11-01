;(function () { // 즉시실행 함수
  'use strict' //문법 오류 잡아줌 + 변수 var, let, const 지정 안 했을 경우 에러 

  const get = (target) => document.querySelector(target);

  const init =() => {
    get('form').addEventListener('submit', (event) => {
      playGame(event)
    });

    setPassWord();
  }

  const baseball = {
    limit : 10,
    digit : 4,
    trial :0,
    end : false,
    $question: get('.ball_question'),
    $answer : get('.ball_answer'),
    $input: get('.ball_input')
  }

  const { limit, digit, $question, $answer, $input } = baseball // destructuring : 객체 값을 바로 사용할 수 있게
  let { trial, end } = baseball // 재할당 되어야 하는 값
  const setPassWord = () =>{
    // 램덤 패스워드 지정
    const gameLimit = Array(limit).fill(false); // 10칸의 배열에 false 로 채움
    let password = '';
    while (password.length < digit){ // digit 자리까지 반복
      const random = parseInt(Math.random() * 10, 10); // Math.random() 은 0~1중에 랜덤이라서 * 10을 함
      

      if(gameLimit[random]){
        continue; // 2. gameLimit 배열에 random 숫자가 있다면(true) 계속 이 if 문 아래는 건너뛴다. ( 중복 없게 )
      }

      password += random;
      gameLimit[random] = true; // 1. 게임리밋 10글자에서 4글자까지만 체크하기 위해서 배열 10개 중에 값이 들어간 자리를 true로 변경함
    }

    baseball.password = password;
  }

  const onPlayed = (number, hint) => {
    // 시도를 했을 때 , number: 내가 입력한 값, hint : 현재 맞춘 상황
    return `<em>${trial}차 시도 : ${number}, ${hint}</emg>`
  }

  const isCorrect = (number, answer) => {
    // 번호가 같은가
    return number === answer
  }

  const isDuplicated = (number) =>{
    // 중복번호가 있는가
    return [... new Set(number.split(''))].length !== digit; // set은 중복없이 배열을 만듬, 중복이 있다면(길이가 같지 않다면) true를 보냄
  }

  const getStrikes = (number, answer) => {
    // 스트라이크 카운트 몇 개
    let strike = 0;
    const nums = number.split('');
    nums.map((digit, index) => { //nums의 값, 순서
      if(digit === answer[index]){ // nums의 값이랑 answer의 index 번째 값이 같으면
        strike++; 
      }
    })

    return strike
  }

  const getBalls = (number, answer) => {
    // 볼 카운트 몇 개
    let ball = 0;
    const nums = number.split('');
    const gameLimit = Array(limit).fill(false);

    answer.split('').map((num) => {
      gameLimit[num] = true; // 10개의 false 배열중에 answer 숫자(4개) 만큼은 true 로 바꿔줌
      /**
       * ex. password = 1256
       * 0 1 2 3 4 5 6 7 8 9
       * false true true false false true true false false false 
       * 
       * 의 형태가 된다.
       */
    })

    nums.map((num, index) => {
      if(answer[index] !== num && !!gameLimit[num]){ // 자리수는 같지 않지만 + gameLimit[num]이 true라면
        ball++;
      }
    })
    return ball
  }

  const getResult = (number, answer) => {
    // 시도에 따른 결과는?
    if(isCorrect(number, answer)){
      end = true;
      $answer.innerHTMl = baseball.password;
      return '홈런!!'
    }

    const strikes = getStrikes(number, answer);
    const balls = getBalls(number, answer);

    return 'STRIKE : ' + strikes + ' BALL : ' + balls;
  }

  const playGame = (event) => {
    // 게임 플레이
    event.preventDefault();

    if(!!end){ // end 값이 true 이면
      return 
    }

    const inputNumber = $input.value;
    const { password } = baseball; // 실제 정답

    if (inputNumber.length !== digit){
      alert(`${digit}자리 숫자를 입력해주세요.`);
    } else if(isDuplicated(inputNumber)){
      alert(`중복된 숫자가 있습니다.`)
    } else {
      trial ++;
      const result = onPlayed(inputNumber, getResult(inputNumber, password))
      $question.innerHTML += `<span>${result}</span>`

      if(limit <= trial && !isCorrect(inputNumber, password)){
        alert(`쓰리아웃!`)
        end = true;
        $answer.innerHTML = password;
      }
    }

    $input.value = '';
    $input.focus();

  }

  init()
})()
