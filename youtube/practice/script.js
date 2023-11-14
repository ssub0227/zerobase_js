;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)
  const getAll = (target) => document.querySelectorAll(target)

  const $search = get('#search')
  const $list = getAll('.contents.list figure')
  const $searchButton = get('.btn_search')
  
  const init = () => {
    $search.addEventListener('keyup', search)
    $searchButton.addEventListener('click', search)
    
    for(let index = 0; index < $list.length; index ++){
      const $target = $list[index].querySelector('picture')
      $target.addEventListener('mouseover', onMouseOver)
      $target.addEventListener('mouseout', onMouseOut)
      $list[index].addEventListener('click', hashChange)
    }

    window.addEventListener('hashchange', ()=>{
      const isView = -1 < window.location.hash.indexOf('view')
      if(isView){
        getViewPage()
      } else{
        getListPage()
      }
    })
  }

  const onMouseOver = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source') // parentNode : 마우스한 요소가 img나 source 이기 때문에 
    webpPlay.setAttribute('srcset', './assets/sample.webp')
  }

  const onMouseOut = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source') 
    webpPlay.setAttribute('srcset', './assets/sample.jpg')
  }

  const search = () =>{
    let searchText = $search.value.toLowerCase()
    for(let index = 0; index < $list.length; index ++){
      const $target = $list[index].querySelector('strong')
      const text = $target.textContent.toLowerCase()

      if(-1 < text.indexOf(searchText)) { // 제목에 검색한 내용이 있다면 그 글자의 index가 출력됨 -> 0부터 시작
        $list[index].style.display = 'flex'
      } else {
        $list[index].style.display = 'none'
      }
    }
  }

  const hashChange = (e) => {
    e.preventDefault() //hashChange는 요소가 클릭되면 실행되기 때문에 a 태그의 기본 기능을 없앰 
    const parentNode = e.target.closest('figure')
    const viewTitle = parentNode.querySelector('strong').textContent
    window.location.hash = `view&${viewTitle}`
  }

  
  const getViewPage = () => {
    const $viewTitle = get('.view strong')
    const urlTitle = decodeURI(window.location.hash.split('&')[1]) // &문자가 이스케이핑 처리 된 것을 decodeURI로 다시 되돌림
    $viewTitle.innerText = urlTitle

    get('.list').style.display = 'none'
    get('.view').style.display = 'flex'
  }

  const getListPage  = () => {
    get('.list').style.display = 'flex'
    get('.view').style.display = 'none'
  }

  init()
})()
