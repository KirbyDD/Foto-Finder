class Photo{
  constructor(id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = false;
  }
  favorite(){
      if(this.favorite == true){
          this.favorite = false;
      } else {
          this.favorite = true;
      }
  }
  saveToStorage(array){
    localStorage.setItem('card', JSON.stringify(array));
  }
  
  deleteFromStorage(id){
    var cardArray = this.pullFromStorage();
    cardArray.splice(this.getIndex(id), 1);
    this.saveToStorage(cardArray);
  }

  updatePhoto(){

  }

  getIndex(articleID){
    return this.pullFromStorage().map(photo => photo.id).indexOf(articleID);
  }

  pullFromStorage() {
    return JSON.parse(localStorage.getItem('card'));
  }
}