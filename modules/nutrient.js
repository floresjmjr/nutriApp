const Item = require('./item.js')


module.exports = {

  vitaminList: function() {
    return Item.vitReferenceArr
  },

  mineralList: function() {
    return Item.minReferenceArr
  },

  filteredResults: function(rawArr) {
    return rawArr.filter((food)=>{
      if (food.name.toLowerCase().includes('restaurant')){
        return false; 
      } else if (food.name.toLowerCase().includes('fast foods')){
        return false;
      } else {
        return true;
      }
    }).slice(0, 50)
  }

}