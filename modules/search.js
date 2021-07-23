
const GenFunc = require('./_community');

module.exports = {
  
  foodDatabase: [],

  capitalizeNames: function(foodList) {
    return foodList.map((foodItem)=>{
      foodItem.name = foodItem.name.toLowerCase()
      var nameArr = foodItem.name.split(' ');
      var formattedNameArr = nameArr.map((string)=>{
        return string.substring(0,1).toUpperCase() + string.substring(1);         
      })
      foodItem.name = formattedNameArr.join(' ');
      return foodItem
    })
  },

  cleanNames: function(itemsArr){
    return itemsArr.map((item)=>{
      item.name = item.name.split(', Upc')[0]
      return item;
    })
  },

  createCategories: function(rawQueryList) {
    let listOfFoodItems = rawQueryList.sort((a,b)=>{ return a.foodCategory - b.foodCategory})
    let categoryObj = this.groupQueryListByCategory(listOfFoodItems);
    console.log('createCategories', categoryObj)
    return categoryObj;
  },

  groupQueryListByCategory: function(rawQueryList) {
    categoryObj = {}                              //name is key, count is value {'Veggies' :  3, 'Nuts': ...}
    rawQueryList.forEach((foodObj)=>{
      let categoryName = foodObj['foodCategory']
      if(categoryObj[categoryName]){                
        categoryObj[categoryName] += 1;      
      } else {
        categoryObj[categoryName] = 1;
      }
    })
    return categoryObj
 },

  chooseProp: function(rawObj) {
    if(rawObj.ds === 'SR'){
      this.ds = 'SR';
      return 'group';
    } else {
      this.ds = 'LI'
      return 'manu';
    }
  },

  filterItemsByCategory: function(categoryName) {
    console.log('filterItemsByCategory', this.foodDatabase[0])
    return this.foodDatabase.filter((foodItem)=>{
      return foodItem['foodCategory'] === categoryName
    })
  },

  foodAPI: function(db, item) {
    let key = "api_key=" + GenFunc.usdaApiKey();
    let database = db === 'SR' ? 'SR Legacy' : 'Foundation'
    let datatype = "&dataType=" + database
    let query = "&query=" + encodeURIComponent(item);
    resultSize = "&pageSize=" + "20"
    var encodedPath = "https://api.nal.usda.gov/fdc/v1/foods/search?" + key + query
    return GenFunc.usdaRequest(encodedPath);
  }

}