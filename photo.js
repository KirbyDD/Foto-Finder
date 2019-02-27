class Photo {
  constructor(id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = false;
  }
  saveToStorage(array) {
    localStorage.setItem('card', JSON.stringify(array));
  }
  
  deleteFromStorage(id) {
    var cardArray = this.pullFromStorage();
    cardArray.splice(this.getIndex(id), 1);
    this.saveToStorage(cardArray);
  }

  updatePhoto(id, favorite) {
    var cardArray = this.pullFromStorage();
    cardArray[this.getIndex(id)].favorite = favorite;
    this.saveToStorage(cardArray);
  }

  getIndex(id) {
    let storage = this.pullFromStorage();
    return storage.map(photo => photo.id).indexOf(id);
  }

  pullFromStorage() {
    return JSON.parse(localStorage.getItem('card'));
  }

  updateTitle(id, title) {
    var cardArray = this.pullFromStorage();
    cardArray[this.getIndex(id)].title = title;
    this.saveToStorage(cardArray);
  }

  updateCaption(id, caption) {
    var cardArray = this.pullFromStorage();
    cardArray[this.getIndex(id)].caption = caption;
    this.saveToStorage(cardArray);
  }
}