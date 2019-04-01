module.exports = {

  createItemObj: function(rawObj) {
    var obj = {};
    obj["name"] = rawObj.name
    obj['unit'] = '100' + rawObj.ru

    var itemNutrients = this.groupById(rawObj.nutrients)
    obj['vitamins'] = itemNutrients.vitamins
    obj['minerals'] = itemNutrients.minerals
    obj['calories'] = itemNutrients.calories
    obj['proteins'] = itemNutrients.proteins
    obj['carbs'] = itemNutrients.carbs
    obj['fats'] = itemNutrients.fats
    return obj;        
  },

  groupById: function(iObjArr) {
    var obj = {calories: [], proteins: [], carbs: [], fats: [], vitamins: [], minerals: []};
    //types
    calories = [208];
    proteins = [203];
    carbs = [205, 291, 269]
    fats = [204, 606, 645, 646];
    vitamins = [401, 404, 405, 406, 410, 415, 417, 421, 454, 320, 323, 430, 328, 418];
    minerals = [301, 303, 304, 305, 306, 307, 309, 312, 315, 317]
    //Collect
    iObjArr.forEach((nObj)=>{
      if (calories.includes(nObj.nutrient_id)) {
        obj.calories.push(this.parseNutritentData(nObj));
      }
      if (proteins.includes(nObj.nutrient_id)) {
        obj.proteins.push(this.parseNutritentData(nObj));
      }
      if (carbs.includes(nObj.nutrient_id)) {
        obj.carbs.push(this.parseNutritentData(nObj));
      }
      if (fats.includes(nObj.nutrient_id)) {
        obj.fats.push(this.parseNutritentData(nObj));
      }
      if (vitamins.includes(nObj.nutrient_id)) {
        obj.vitamins.push(this.parseNutritentData(nObj));
      }
      if (minerals.includes(nObj.nutrient_id)) {
        obj.minerals.push(this.parseNutritentData(nObj));
      }
    })
    return this.restructureNutrients(obj)
  },

  restructureNutrients: function(itemObj) {
    itemObj.calories = this.calculateCalories(itemObj);
    itemObj.proteins = this.reProteinsObj(itemObj.proteins);
    itemObj.carbs = this.reCarbsObj(itemObj.carbs);
    itemObj.fats = this.reFatsObj(itemObj.fats);
    itemObj.vitamins = this.sortNames(itemObj.vitamins);
    itemObj.minerals = this.sortNames(itemObj.minerals);  
    return itemObj;
  },

  parseNutritentData: function(nObj) {
    if (nObj.group === 'Lipids') {
      var name = nObj.name.split(' ')[3];
      nObj.name = name[0].toUpperCase() + name.substring(1) + ' Fat';
    } else {
      nObj.name = nObj.name.split(',')[0];
    }
    return nObj;
  },

  sortNames: function(nObjArr) {
    return nObjArr.sort((obj1, obj2)=>{
      if (obj1.name > obj2.name){
        return 1;
      }
      if (obj1.name < obj2.name) {
        return -1;
      }
      return 0;
    })
  },

  calculateCalories: function(nObjArr) {
    var newCatObj = {"total": {}, "list": []};
    newCatObj.total = nObjArr.calories[0]
    //Calculating the carb calories
    nObjArr.carbs.forEach((nObj)=>{
      if(nObj.name === 'Carbohydrate') {
        var value = (Number(nObj.value) * 4).toFixed(2)
        var newNObj = {"name": "Carbohydrate", "value": value, "unit": "kcal" }
        newCatObj.list.push(newNObj)
      }
    })
    //Calculating the carb calories
    nObjArr.fats.forEach((nObj)=>{
      if(nObj.name === 'Total lipid (fat)') {
        var value = (Number(nObj.value) * 9).toFixed(2)
        var newNObj = {"name": "Fat", "value": value, "unit": "kcal" }
        newCatObj.list.push(newNObj)
      }
    })
    //Calculating the carb calories
    var value = (Number(nObjArr.proteins[0].value) * 4).toFixed(2)
    var newNObj = {"name": "Protein", "value": value, "unit": "kcal" }
    newCatObj.list.push(newNObj)

    return newCatObj;
  },

  reProteinsObj: function(nObjArr) {
    var newCatObj = {};
    newCatObj.total = nObjArr[0]
    return newCatObj;
  },

  reCarbsObj: function(nObjArr) {
    var newCatObj = {'total': {}, 'list': []};
    nObjArr.forEach((nObj)=>{
      if(nObj.name === 'Carbohydrate') {
        newCatObj.total = nObj
      } else {
        newCatObj.list.push(nObj)
      }
    })
    return newCatObj;
  },

  reFatsObj: function(nObjArr) {
    var newCatObj = {'total': {}, 'list': []};
    nObjArr.forEach((nObj)=>{
      if(nObj.name === 'Total lipid (fat)') {
        newCatObj.total = nObj
      } else {
        newCatObj.list.push(nObj)
      }
    })
    return newCatObj;    
  },

}