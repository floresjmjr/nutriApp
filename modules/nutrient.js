const GenFunc = require('./_community')

module.exports = {

  createNutrientList: function() {
    return (GenFunc.vitReferenceArr).concat(GenFunc.minReferenceArr)
  },

  filterNformat: function(rawArr) {
    var filteredArr = this.filteredResults(rawArr);
    return GenFunc.formatNames(filteredArr)
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
  },

}