var titleInput = document.querySelector('#title');
var captionInput = document.querySelector('#caption');
var chooseFile = document.querySelector('#choose-file');
var viewFavsBtn = document.querySelector('#view-favs-btn');
var addBtn = document.querySelector('#add-btn');
var cardSection = document.querySelector('#card-sec');
var deleteBtn = document.querySelector('#del-btn')
var cardArray = JSON.parse(localStorage.getItem('card')) || [];
var newCard = new Photo();


window.addEventListener('load', loadPreviousCards(cardArray));
addBtn.addEventListener('click', convertImage);
cardSection.addEventListener('click', deleteOrFav);

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
    newCard = new Photo(id, title, caption, file);
    cardArray.push(newCard);
    newCard.saveToStorage(cardArray);
    
    cardSection.innerHTML = `<article data-id="${id}">
    <p class="card-title card-p">${title}</p>
    <img src="${file}" alt="" class="card-img">
    <p class="card-body card-p">${caption}</p>
    <div>
        <img src="images/delete.svg" alt="" class="delete-btn article-btn">
        <img src="images/favorite.svg" alt="" class="fav-btn article-btn">
    </div>
    </article>` + cardSection.innerHTML
}

function generateCards(id, title, caption, file) {
    cardSection.innerHTML = `<article data-id="${id}">
    <p class="card-title card-p">${title}</p>
    <img src="${file}" alt="" class="card-img">
    <p class="card-body card-p">${caption}</p>
    <div>
        <img src="images/delete.svg" alt="" class="delete-btn article-btn">
        <img src="images/favorite.svg" alt="" class="fav-btn article-btn">
    </div>
    </article>` + cardSection.innerHTML
}


function loadPreviousCards() {
    if (cardArray.length > 10) {
     var slicedCardArr = cardArray.slice(cardArray.length - 10);
      for (var i = 0; i < slicedCardArr.length; i++) {
        generateCards(slicedCardArr[i].id, slicedCardArr[i].title, slicedCardArr[i].caption,  slicedCardArr[i].file);
    }
 } else {
        for (var i = 0; i < cardArray.length; i++) {
        generateCards(cardArray[i].id, cardArray[i].title, cardArray[i].caption,  cardArray[i].file);
    }
    // hideShowMore();
  }
}

function deleteOrFav(event){
    if(event.target.classList.contains('delete-btn')) {
    var articleId = event.target.parentElement.parentElement.dataset.id
    newCard.deleteFromStorage(parseInt(articleId));
        event.target.parentElement.parentElement.remove();
    } else if(event.target.classList.contains('fav-btn')) {
        console.log('Favorite this!')
    }
}