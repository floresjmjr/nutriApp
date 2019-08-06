
// // Search Example Objects
// var createCategories = {
//   [ { id: 0, name: 'Baby foods', count: 2 },
//   { id: 2,
//     name: 'Meals, entrees, and side dishes',
//     count: 2
//   { id: 3,
//     name: 'Soups, sauces, and gravies',
//     count: 2
//   { id: 1,
//     name: 'Vegetables and vegetable products',
//     count: 2
// }

// var getFoodListById = { 
//   id: 0,
//   name: 'Baby foods',
//   items:
//    [ { offset: 0,
//        group: 'Baby Foods',
//        name: 'Babyfood, dinner, broccoli and chicken, junior',
//        ndbno: '03298',
//        ds: 'SR',
//        manu: 'none' },
//      { offset: 1,
//        group: 'Baby Foods',
//        name: 'Babyfood, mashed cheddar potatoes and broccoli, toddlers',
//        ndbno: '03959',
//        ds: 'SR',
//        manu: 'none' } ] }
// }

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
    var categoriesObj = this.groupQueryListByCategory(rawQueryList);
    var categoriesObjArr = this.reCreateCategoryList(categoriesObj);
    categoriesObjArr = this.sortGroups(categoriesObjArr);
    categoriesObjArr = this.capitalizeNames(categoriesObjArr)
    this.foodDatabase = categoriesObjArr;
    categoriesObjArr = categoriesObjArr.slice(0, 20);
    categoriesObjArr = this.sortAsc(categoriesObjArr);
    return this.condenseCatData(categoriesObjArr);
  },

  groupQueryListByCategory: function(rawQueryList) {
    return rawQueryList.reduce((acc, obj)=> {
     var prop = this.chooseProp(obj);
     var key = obj[prop];
     if(!acc[key]) {
       acc[key] = [];
     }
     acc[key].push(obj);
     return acc;
   }, {})
 },

  reCreateCategoryList: function(catObj) {
    var counter = -1;
    var keys = Object.keys(catObj);
    return keys.map((categoryName)=>{
      var categoryObj = {};
      categoryObj['id'] = counter += 1;
      categoryObj['name'] = categoryName;
      categoryObj['items'] = catObj[categoryName];
      return categoryObj;
    })
  },

  condenseCatData: function(catArr){
    return catArr.map((catObj)=> {
      return {'id': catObj.id, 'name': catObj.name, 'count': catObj.items.length}
    })
  },

  sortAsc: function(catArr) {
    return catArr.sort((catObj1, catObj2)=>{
      if (catObj1.name > catObj2.name) {
        return 1;
      }
      if (catObj1.name < catObj2.name) {
        return -1;
      }
      return 0;
    })
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

  getCategories: function(db, query) {
    var apiKey = GenFunc.usdaApiKey();
    var encodedDB = db === 'SR' ? 'Standard%20Reference' : 'Branded%20Food%20Products'
    var encodedQuery = encodeURIComponent(query);
    var encodedPath = `https://api.nal.usda.gov/ndb/search/?format=json&q=${encodedQuery}&ds=${encodedDB}&sort=n&max=500&offset=0&api_key=${apiKey}`
    return GenFunc.usdaRequest(encodedPath);
  }

}