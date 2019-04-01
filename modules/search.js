

module.exports = {
  
  foodGroups: [],

  parseData: function(resultObjs, query) {
    var sortedData = this.sortData(resultObjs, query);
    var srDB = [];
    var liDB = [];
    sortedData.forEach((obj)=>{
      if(obj.ds.toUpperCase() === 'SR') {
        srDB.push(obj);
      } else {
        liDB.push(obj);
      }
    })
    return this.cleanData(srDB.concat(liDB));
  },
  
  cleanData: function(resultObjs) {
    return resultObjs.map((item)=> {
      item.name = item.name.toLowerCase();
      item.name = item.name[0].toUpperCase() + item.name.substring(1);
      if (item.name.includes('upc')) {
        item.code = item.name.substring(item.name.indexOf('upc'));
        item.name = item.name.substring(0, item.name.indexOf('upc'));

      } else if (item.name.includes('gtin')) {
        item.code = item.name.substring(item.name.indexOf('gtin'));
        item.name = item.name.substring(0, item.name.indexOf('gtin'));
      }
      return {'name': item.name, 'ndbno': item.ndbno, 'manu': item.manu, 'code': item.code, 'ds': item.ds};
    })
  },

  sortData: function(resultObjs, searchTerm) {
    return resultObjs.sort((item1,item2)=>{
      var itemName = item1.name.split(' ')[0].toLowerCase();
      if (itemName.toLowerCase() === 'cheese') {
        return 0;
      }
      if (item1.name.split(' ')[0] !== searchTerm) {
        return 1;
      }
    })
  },

  createFoodGroups: function(objArr) {
    var groupedObjs = this.groupBy(objArr, 'group');
    var foodGroups = this.reorganizeGroups(groupedObjs);
    var sortedGroups = this.sortGroups(foodGroups);
    this.foodGroups = sortedGroups;
    return sortedGroups;
  },

  groupBy: function(objArr, prop) {
     return objArr.reduce(function(acc, obj) {
      var key = obj[prop];
      if(!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {})
  },

  reorganizeGroups: function(objArr) {
    console.log('reorganizeGroups')
    var counter = -1;
    var keys = Object.keys(objArr);
    return keys.map((groupName)=>{
      var obj = {};
      obj['id'] = counter += 1;
      obj['name'] = groupName;
      obj['items'] = objArr[groupName];
      return obj;
    })
  },

  sortGroups: function(objArr) {
    console.log('sortGroups')
    return objArr.sort((obj1, obj2)=>{
      if (obj1.items.length > obj2.items.length) {
        return -1
      }
      if (obj1.items.length < obj2.items.length) {
        return 1
      }
      return 0;
    })
  },

  getFoodGroupById: function(id) {
    console.log('getFoodGroupById');
    return this.foodGroups.filter((group)=>{
      if (String(group.id) === id) {
        return group;
      }
    })[0]
  },

}