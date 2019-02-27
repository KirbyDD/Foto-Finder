var titleInput = document.querySelector('#title');
var captionInput = document.querySelector('#caption');
var chooseFile = document.querySelector('#choose-file');
var viewFavsBtn = document.querySelector('#view-favs-btn');
var addBtn = document.querySelector('#add-btn');
var cardSection = document.querySelector('#card-sec');
var deleteBtn = document.querySelector('#del-btn');
var numOfFavs = document.querySelector('#fav-counter');
var searchBox = document.querySelector('#search-box');
var showToggleBtn = document.querySelector('#show-toggle');
var cardArray = JSON.parse(localStorage.getItem('card')) || [];

var newCard = new Photo();


window.addEventListener('load', loadPreviousCards(cardArray));
addBtn.addEventListener('click', convertImage);
showToggleBtn.addEventListener('click', toggleCards)
viewFavsBtn.addEventListener('click', toggleFavs)
cardSection.addEventListener('click', deleteOrFav);
cardSection.addEventListener('keyup', editContent);
searchBox.addEventListener('keyup', function(e) {
    if (searchBox.value) {
      cardSection.innerHTML = '';
      filterContent(searchBox.value);
    } else if (!searchBox.value) {
      cardSection.innerHTML = '';
      loadPreviousCards();
    }
  });

function convertImage(e){
    var reader = new FileReader();
    var selectedImage = chooseFile.files[0];
    reader.readAsDataURL(selectedImage);
    reader.onload = function(){
        imageResult(reader.result)
    }
    e.preventDefault();
}

function imageResult(newImage){
    createCard(newImage);
}

function createCard(file){
    var id = Math.floor(Date.now());
    var title = titleInput.value;
    var caption = captionInput.value;
    if(cardSection.innerHTML == `<h2>Please add a photo</h2>`){
        cardSection.innerHTML = '';
    }
    if(!title || !caption || !file){
        return;
    } else {
    newCard = new Photo(id, title, caption, file);
    var cardArray = JSON.parse(localStorage.getItem('card'))
    cardArray.push(newCard);
    newCard.saveToStorage(cardArray);
    cardSection.innerHTML = `<article data-id="${id}">
    <p class="card-title card-p" contenteditable="true">${title}</p>
    <img src="${file}" alt="" class="card-img">
    <p class="card-body card-p" contenteditable="true">${caption}</p>
    <div>
        <img src="images/delete.svg" alt="" class="delete-btn article-btn">
        <img src="images/favorite.svg" alt="" class="fav-btn article-btn">
    </div>
    </article>` + cardSection.innerHTML
    }
}

function generateCards(id, title, caption, file, favorite) {
    var faveSrc = "images/favorite.svg";
    if (favorite){
        var faveSrc = 'images/favorite-active.svg'
    }

    cardSection.innerHTML = `<article data-id="${id}">
    <p class="card-title card-p" contenteditable="true">${title}</p>
    <img src="${file}" alt="" class="card-img">
    <p class="card-body card-p" contenteditable="true">${caption}</p>
    <div>
        <img src="images/delete.svg" alt="" class="delete-btn article-btn">
        <img src=${faveSrc} alt="" class="fav-btn article-btn">
    </div>
    </article>` + cardSection.innerHTML
}


function loadPreviousCards() {
    if (cardArray.length > 10) {
     var slicedCardArr = cardArray.slice(cardArray.length - 10);
     cardSection.innerHTML = '';
       for (var i = 0; i < slicedCardArr.length; i++) {
        generateCards(slicedCardArr[i].id, slicedCardArr[i].title, slicedCardArr[i].caption,  slicedCardArr[i].file, cardArray[i].favorite);
        setCount();
      }
    } else {
        cardSection.innerHTML = '';
        for (var i = 0; i < cardArray.length; i++) {
        generateCards(cardArray[i].id, cardArray[i].title, cardArray[i].caption, cardArray[i].file, cardArray[i].favorite);
        setCount();
    }
    noPhotos();
    // hideShowMore();
  }
}

function deleteOrFav(event){
    (event.target.value ^= true)
    if(event.target.classList.contains('delete-btn')) {
    var articleId = event.target.parentElement.parentElement.dataset.id
    newCard.deleteFromStorage(parseInt(articleId));
        event.target.parentElement.parentElement.remove();
        setCount();
        noPhotos();
    } else {
        var articleId = event.target.parentElement.parentElement.dataset.id
        swap(articleId);
    }
}

function swap(id){
    if(event.target.classList.contains('fav-btn') && event.target.value == 1 ) {
        event.target.src = 'images/favorite-active.svg';
        newCard.updatePhoto(parseInt(id), true);
        setCount();
    } else if(event.target.classList.contains('fav-btn') && event.target.value == 0 ){
        event.target.src = 'images/favorite.svg';
        newCard.updatePhoto(parseInt(id), false);            
        setCount();
    }
}

function editContent(event){
    var articleId = event.target.parentElement.dataset.id;
    var changeContent = event.target.innerText;
    if (event.target.classList.contains('card-title')){
    newCard.updateTitle(parseInt(articleId), changeContent);
    } else {
        newCard.updateCaption(parseInt(articleId), changeContent);
    }
}

function faveCount(){
    let faveArray = JSON.parse(localStorage.getItem('card'));
    let updatedArray = faveArray.filter(card => card.favorite);
    return updatedArray.length;
}

function setCount(){
    console.log(numOfFavs);
    var num = faveCount();
    numOfFavs.innerText = num;
}

function noPhotos(){
    if(cardSection.innerHTML == ''){
        cardSection.innerHTML = `<h2>Please add a photo</h2>`;
    }
}

function filterContent(searchText){
    var updatedCardArray = newCard.pullFromStorage();
    var filterMatch = updatedCardArray.filter(card => card.title.toUpperCase().indexOf(searchText.toUpperCase()) === 0 ||
      card.caption.toUpperCase().indexOf(searchText.toUpperCase()) === 0);
    var filterMatchFav = updatedCardArray.filter(card => card.title.toUpperCase().indexOf(searchText.toUpperCase()) === 0 
    && (card.favorite) ||
    card.caption.toUpperCase().indexOf(searchText.toUpperCase()) === 0 && (card.favorite));
    
    if(filterMatchFav.length && viewFavsBtn.innerText == "View All Photos"){
        for (var i = 0; i < filterMatchFav.length; i++) {
            generateCards(filterMatchFav[i].id, filterMatchFav[i].title, filterMatchFav[i].caption, filterMatchFav[i].file, filterMatchFav[i].favorite);
        } 
    } else if (filterMatch.length) {
        for (var i = 0; i < filterMatch.length; i++) {
          generateCards(filterMatch[i].id, filterMatch[i].title, filterMatch[i].caption, filterMatch[i].file, filterMatch[i].favorite);
        } 
    }
}

function toggleCards() {
    if (showToggleBtn.innerText == "Show More") {
      showToggleBtn.innerText = "Show Less";
      cardSection.innerHTML = '';
      for (var i = 0; i < cardArray.length; i++) {
        generateCards(cardArray[i].id, cardArray[i].title, cardArray[i].caption,  cardArray[i].file, cardArray[i].favorite);
      }
    } else {
      showToggleBtn.innerText = "Show More";
      cardSection.innerHTML = '';
      loadPreviousCards();
    }
  }

  function toggleFavs(event) {
    event.preventDefault();
    var updatedCardArray = newCard.pullFromStorage();
    var filterMatch = updatedCardArray.filter(card => card.favorite)
    if (viewFavsBtn.innerText !== "View All Photos") {
      viewFavsBtn.innerText = "View All Photos";
      cardSection.innerHTML = '';
      for (var i = 0; i < filterMatch.length; i++) {
        generateCards(filterMatch[i].id, filterMatch[i].title, filterMatch[i].caption,  filterMatch[i].file, filterMatch[i].favorite);
      }
    } else {
      viewFavsBtn.innerHTML = `View <span id="fav-counter">${faveCount()}</span> Favorites`;
      cardSection.innerHTML = '';
      loadPreviousCards();
    }
  }