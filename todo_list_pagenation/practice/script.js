;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const API_URL = 'http://localhost:3000/todos';
  const $todos = get('.todos');
  const $form = get('.todo_form');
  const $todoInput = get('.todo_input');

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
    fetch(API_URL).then((response) => response.json()).then((response) => renderAllTodos(response)).catch((error) => console.error(error))
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
    });

    $form.addEventListener('submit', addTodo);
    $todos.addEventListener('click',toggleTodo);
    $todos.addEventListener('click',changeEditMode);
    $todos.addEventListener('click',editTodo);
    $todos.addEventListener('click',removeTodo);
  }
  init()
})()
