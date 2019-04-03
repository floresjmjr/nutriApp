// // Item Example Object
// var itemObj = { 
//   name: 'Broccoli, raw',
//   unit: '100g',
//   vitamins:
//    [ { nutrient_id: 454,
//        name: 'Betaine',
//        group: 'Vitamins',
//        unit: 'mg',
//        value: 0.1,
//        sourcecode: [Array],
//        dp: 2,
//        se: '',
//        derivation: 'NONE',
//        measures: [Array] },
//      { nutrient_id: 421,
//        name: 'Choline',
//        group: 'Vitamins',
//        unit: 'mg',
//        value: 18.7,
//        sourcecode: [Array],
//        dp: '',
//        se: '',
//        derivation: 'AS',
//        measures: [Array] },....



module.exports = {

  vitReferenceArr: [{id: 401, name: 'Vitamin C'}, {id: 404, name: 'Thiamin'}, {id: 405, name: 'Riboflavin'}, {id: 406, name: 'Niacin'}, {id: 410, name: 'Pantothenic acid'}, {id: 415, name: 'Vitamin B-6'}, {id: 417, name: 'Folate'}, {id: 421, name: 'Choline'}, {id: 454, name: 'Betaine'} , {id: 320, name: 'Vitamin A'}, {id: 323, name: 'Vitamin E'}, {id: 430, name: 'Vitamin K'}, {id: 328, name: 'Vitamin D'}, {id: 418, name: 'Vitamin B-12'}],
  minReferenceArr: [{id: 301, name: 'Calcium'}, {id: 303, name: 'Iron'}, {id: 304, name: 'Magnesium'}, {id: 305, name: 'Phosphorus'}, {id: 306, name: 'Potassium'}, {id: 307, name: 'Sodium'}, {id: 309, name: 'Zinc'}, {id: 312, name: 'Copper'}, {id: 315, name: 'Manganese'}, {id: 317, name: 'Selenium'}],
 
  createItemObj: function(rawObj) {
    var newItemObj = {};
    newItemObj["name"] = rawObj.name
    newItemObj['unit'] = '100' + rawObj.ru

    var partialItemObj = this.groupNutrientTypes(rawObj.nutrients)
    partialItemObj = this.reCreateItemObj(partialItemObj)
    newItemObj['vitamins'] = partialItemObj.vitamins
    newItemObj['minerals'] = partialItemObj.minerals
    newItemObj['calories'] = partialItemObj.calories
    newItemObj['proteins'] = partialItemObj.proteins
    newItemObj['carbs'] = partialItemObj.carbs
    newItemObj['fats'] = partialItemObj.fats
    console.log(newItemObj);
    return newItemObj;        
  },

  groupNutrientTypes: function(rawNutrientsArr) {
    var partialItemObj = {calories: [], proteins: [], carbs: [], fats: [], vitamins: [], minerals: []};
    //Nutrient Types
    var calories = [208];
    var proteins = [203];
    var carbs = [205, 291, 269]
    var fats = [204, 606, 645, 646];
    var mineralIds = this.minReferenceArr.map((obj)=>{return obj.id})
    var vitaminIds = this.vitReferenceArr.map((obj)=>{return obj.id})
     //Group by Nutrient Types
    rawNutrientsArr.forEach((nObj)=>{
      if (calories.includes(Number(nObj.nutrient_id))) {
        partialItemObj.calories.push(this.parseNutritentData(nObj));
      }
      if (proteins.includes(Number(nObj.nutrient_id))) {
        partialItemObj.proteins.push(this.parseNutritentData(nObj));
      }
      if (carbs.includes(Number(nObj.nutrient_id))) {
        partialItemObj.carbs.push(this.parseNutritentData(nObj));
      }
      if (fats.includes(Number(nObj.nutrient_id))) {
        partialItemObj.fats.push(this.parseNutritentData(nObj));
      }
      if (vitaminIds.includes(Number(nObj.nutrient_id))) {
        partialItemObj.vitamins.push(this.parseNutritentData(nObj));
      }
      if (mineralIds.includes(Number(nObj.nutrient_id))) {
        partialItemObj.minerals.push(this.parseNutritentData(nObj));
      }
    })
    return partialItemObj;
  },

  reCreateItemObj: function(itemObj) {
    itemObj.calories = this.calculateCalories(itemObj);
    itemObj.proteins = this.reProteinsObj(itemObj.proteins);
    itemObj.carbs = this.reCarbsObj(itemObj.carbs);
    itemObj.fats = this.reFatsObj(itemObj.fats);

    //Vitamins and Minerals
    itemObj.vitamins = this.setViTMinTemplate(itemObj.vitamins, 'vitamins');
    itemObj.minerals = this.setViTMinTemplate(itemObj.minerals, 'minerals');
   
    itemObj.vitamins = this.sortNames(itemObj.vitamins);
    itemObj.minerals = this.sortNames(itemObj.minerals);  
    return itemObj;
  },

  setViTMinTemplate: function(nArr, type) {
    var ids = [];
    var missingNutrients = [];
    var queryNutrientIds = nArr.map((nObj)=>{return nObj.nutrient_id})
    // Create id array for type of nutrient
    if (type === 'vitamins') {
      ids = this.vitReferenceArr.map((obj)=>{return obj.id})
    }
    if (type === 'minerals') {
      ids = this.minReferenceArr.map((obj)=>{return obj.id})
    }
    // Find which nutrients are missing using the reference data
    ids.forEach((id, index)=>{
      if(queryNutrientIds.includes(id)){ 
      } else {
        missingNutrients.push(this.createNutrientTemplate(index, type));
      }
    })
    return nArr.concat(missingNutrients)
  },

  createNutrientTemplate: function(index, type) {
    newNObj = {};
    
    if (type === 'vitamins') {
      newNObj.nutrient_id = this.vitReferenceArr[index].id
      newNObj.name = this.vitReferenceArr[index].name
    }
    
    if (type === 'minerals') {
      newNObj.nutrient_id = this.minReferenceArr[index].id
      newNObj.name = this.minReferenceArr[index].name 
    }
    
    newNObj['value'] = 'unk';
    newNObj['unit'] = '';
    return newNObj;
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
    newCatObj.total = {nutrient_id: nObjArr[0].nutrient_id, name: nObjArr[0].name, unit: nObjArr[0].unit, value: nObjArr[0].value}
    return newCatObj;
  },

  reCarbsObj: function(nObjArr) {
    var newCatObj = {'total': {}, 'list': []};
    nObjArr.forEach((nObj)=>{
      if(nObj.name === 'Carbohydrate') {
        newCatObj.total = {nutrient_id: nObj.nutrient_id, name: nObj.name, unit: nObj.unit, value: nObj.value}
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
        newCatObj.total = {nutrient_id: nObj.nutrient_id, name: nObj.name, unit: nObj.unit, value: nObj.value}
      } else {
        newCatObj.list.push(nObj)
      }
    })
    return newCatObj;    
  },

}