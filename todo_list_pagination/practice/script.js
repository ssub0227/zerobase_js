;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const API_URL = 'http://localhost:3000/todos';
  const $todos = get('.todos');
  const $form = get('.todo_form');
  const $todoInput = get('.todo_input');
  const $pagination = get('.pagination');

  const limit = 5;
  let currentPage = 1;
  const totalCount = 53; // 현재 json 서버라 임의 지정
  const pageCount = 5;
  
  // 페이지네이션
  const pagiNation = () =>{
    //총 페이지 갯수 계산하기
    let totalPage = Math.ceil(totalCount / limit);
    
    //현재 페이지 그룹
    let pageGroup = Math.ceil(currentPage / pageCount);

    //현재 페이지 그룹 첫번째와 마지막 구하기
    let lastNumber = pageGroup * pageCount;
    if (lastNumber > totalPage){ // 마지막 숫자가 전체보다 크면 마지막 페이지를 전체 페이지로 맞춤
      lastNumber = totalPage 
    }
    let firstNumber = lastNumber - (pageCount - 1);
    
    const next = lastNumber + 1;
    const prev = firstNumber - 1;

    let html = ``;

    // 이전 버튼 보이게
    if (prev > 0) {
      html += '<button class="prev" data-fn="prev">이전</button>'
    }

    // 1~5만큼 페이지네이션 그려줌
    for (let i = firstNumber; i <= lastNumber; i++) {
      html += `<button class="pageNumber" id="page_${i}">${i}</button>`
    }

    // 다음 버튼 보이게
    if (lastNumber != totalPage) {
      html += '<button class="next" data-fn="next">다음</button>'
    }

    $pagination.innerHTML = html;

    const $currentPageNumber = get(`.pageNumber#page_${currentPage}`);
    $currentPageNumber.style.color = "#9dc8e9";

    const $currentPageNumbers = document.querySelectorAll(".pagination button");
    $currentPageNumbers.forEach(button => {
      button.addEventListener('click',() => {
        if(button.dataset.fn == "prev"){
          currentPage = prev;
        } else if(button.dataset.fn == "next"){
          currentPage = next;
        } else {
          currentPage = button.innerText;
        }
        pagiNation();
        getTodos();
      })
    })

  }

  const createTodoElement = (item) => {
    const { id, content, completed } = item
    const $todoItem = document.createElement('div')
    const isChecked = completed == true ? "checked" : ''
    $todoItem.classList.add('item')
    $todoItem.dataset.id = id
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
                ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `
    return $todoItem
  }

  const renderAllTodos = (todos) =>{
    $todos.innerHTML ='';
    todos.forEach(item => {
      const todoElement = createTodoElement(item);
      $todos.appendChild(todoElement);
    });
  }

  // json-server fetch
  const getTodos = () =>{
    fetch(`${API_URL}?_page=${currentPage}&_limit=${limit}`).then((response) => response.json()).then((response) => renderAllTodos(response)).catch((error) => console.error(error))
  } 

  // input 입력시 list에 add
  const addTodo = (e) => {
    e.preventDefault(); // sumbit 이벤트의 경우 제출시 새로고침이 기본이라 그 기능을 막음. 
    const todo = {
     content: $todoInput.value,
     completed:false,   
    }
    fetch(API_URL,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo), // javascript 객체를 json 으로 변환
    }).then(getTodos).then(() => {$todoInput.value = '', $todoInput.focus()}).catch((error) => console.error(error))
  }

  //체크박스 통신
  const toggleTodo = (e) => {
    if (e.target.className !== 'todo_checkbox') return
    const completed = e.target.checked;
    const $item = e.target.closest('.item');
    const id = $item.dataset.id;
    
    fetch(`${API_URL}/${id}`,{
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    }).then(getTodos).catch((error)=>{console.error(error)})
  }

  // 수정 버튼 눌렀을 경우 
  const changeEditMode = (e) =>{
    const $item = e.target.closest('.item');
    const $label = $item.querySelector('label');
    const $editInput = $item.querySelector('input[type="text"]');
    const $contentButton = $item.querySelector('.content_buttons');
    const $editButton = $item.querySelector('.edit_buttons');   
    const editInputValue = $editInput.value;
    
    if(e.target.className === 'todo_edit_button'){
      $label.style.display ='none';
      $editInput.style.display ='block';
      $contentButton.style.display ='none';
      $editButton.style.display ='flex';
      $editInput.focus();
      $editInput.value = '';
      $editInput.value = editInputValue;

    }

    if(e.target.className === 'todo_edit_cancel_button'){
      $label.style.display ='block';
      $editInput.style.display ='none';
      $contentButton.style.display ='flex';
      $editButton.style.display ='none';
      $editInput.value = $label.innerHTML;
    }
  }

  // 수정 버튼 클릭 후 수정 완료 시
  const editTodo = (e) => {
    if(e.target.classList != 'todo_edit_confirm_button') return;
    const $item = e.target.closest('.item');
    const id = $item.dataset.id;
    const $editInput = $item.querySelector('input[type="text"]');
    const content = $editInput.value;
    
    fetch(`${API_URL}/${id}`,{
      method:'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    }).then(getTodos).catch((error) => {console.error(error)})
  }

  // 투두 리스트 삭제
  const removeTodo = (e) =>{
    if(e.target.classList == 'todo_remove_button'){
      const $item = e.target.closest('.item');
      const id = $item.dataset.id; 

      fetch(`${API_URL}/${id}`,{
        method:'DELETE'}).then(getTodos).catch((error) => console.error(error))
    }
  }

  //실제 실행되는 함수들
  const init = () => {
    window.addEventListener('DOMContentLoaded', ()=>{
      getTodos();
      pagiNation();
    });

    $form.addEventListener('submit', addTodo);
    $todos.addEventListener('click',toggleTodo);
    $todos.addEventListener('click',changeEditMode);
    $todos.addEventListener('click',editTodo);
    $todos.addEventListener('click',removeTodo);
  }
  init()
})()
