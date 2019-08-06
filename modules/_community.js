const request = require('request');

module.exports = {
  
  vitReferenceArr: [{id: 401, name: 'Vitamin C'}, {id: 404, name: 'Thiamin'}, {id: 405, name: 'Riboflavin'}, {id: 406, name: 'Niacin'}, {id: 410, name: 'Pantothenic acid'}, {id: 415, name: 'Vitamin B-6'}, {id: 417, name: 'Folate'}, {id: 421, name: 'Choline'}, {id: 320, name: 'Vitamin A'}, {id: 323, name: 'Vitamin E'}, {id: 430, name: 'Vitamin K'}, {id: 328, name: 'Vitamin D'}, {id: 418, name: 'Vitamin B-12'}],
  minReferenceArr: [{id: 301, name: 'Calcium'}, {id: 303, name: 'Iron'}, {id: 304, name: 'Magnesium'}, {id: 305, name: 'Phosphorus'}, {id: 306, name: 'Potassium'}, {id: 307, name: 'Sodium'}, {id: 309, name: 'Zinc'}, {id: 312, name: 'Copper'}, {id: 315, name: 'Manganese'}, {id: 317, name: 'Selenium'}],
  components: ['vitamins', 'minerals', 'fats', 'carbs', 'proteins', 'calories'],

  usdaApiKey: function(){
    return process.env.USDA_API_KEY;
  },

  cleanName: function(name){
    console.log('cleanName')
    var result = name.split(', UPC')[0];
    return this.capitalizeName(result)
  },

  capitalizeName: function(name) {
    var splitName = name.split(' ')
    return splitName.map((str)=>{
      var lname = str.toLowerCase()
      return lname.substring(0,1).toUpperCase() + lname.substring(1)
    }).join(' ')
  },

  formatNames: function(foodArr) {
    // console.log('nameArray123', foodArr.slice(0,5));
    return foodArr.map((food)=>{
      food.name = this.capitalizeName(food.name);
      return food;
    })
  },

  usdaRequest: function(url){
    return new Promise((resolve, reject)=>{
      request(url, (error, response, body)=>{
        resolve(JSON.parse(body))
        reject(error);
      })
    })
  },



}