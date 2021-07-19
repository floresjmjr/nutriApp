
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
      if(categoryObj[categoryName]){                //
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

  sortGroups: function(catArr) {
    console.log('SortGroups')
    return catArr.sort((cat1, cat2)=>{
      if (cat1.items.length > cat2.items.length) {
        return -1
      }
      if (cat1.items.length < cat2.items.length) {
        return 1
      }
      return 0;
    })
  },

  getItemsByCatId: function(catId) {
    var categoryObj = this.searchById(catId);
    // console.log('categoryObj', categoryObj);
    categoryObj.items = this.capitalizeNames(categoryObj.items)
    if (this.ds === 'LI') {
      categoryObj.items = this.cleanNames(categoryObj.items)      
    }
    categoryObj = this.maxResults(categoryObj)
    return categoryObj;
  },

  maxResults(categoryObj) {
    categoryObj.items = categoryObj.items.slice(0,100)
    return categoryObj
  },

  searchById: function(catId) {
    return this.foodDatabase.filter((catObj)=>{
      if (String(catObj.id) === catId) {
        return catObj;
      }
    })[0]
  },

  getCategories: function(db, item) {
    let key = "api_key=" + GenFunc.usdaApiKey();
    let database = db === 'SR' ? 'SR Legacy' : 'Foundation'
    let datatype = "&dataType=" + database
    let query = "&query=" + encodeURIComponent(item);
    resultSize = "&pageSize=" + "20"
    var encodedPath = "https://api.nal.usda.gov/fdc/v1/foods/search?" + key + query + datatype + resultSize
    return GenFunc.usdaRequest(encodedPath);
  }

}