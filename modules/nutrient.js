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
    })
  },

  getFoodListByNutrient: function(nutrient) {
    var apiKey = GenFunc.usdaApiKey();
    var encodedPath = `https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=${apiKey}&nutrients=${nutrient}&sort=c&max=200`
    return GenFunc.usdaRequest(encodedPath)
  }, 

  findNameById: function(nutrientId) {
    var name = '';
    const arr = this.createNutrientList()
    arr.forEach((nutrient)=>{
      if(nutrient.id === Number(nutrientId)){
        name = nutrient.name;
      }
    })
    return name;
  },

}