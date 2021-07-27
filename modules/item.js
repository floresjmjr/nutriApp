
var GenFunc = require('./_community');

module.exports = {

  vitReferenceArr: GenFunc.vitReferenceArr,
  minReferenceArr: GenFunc.minReferenceArr,
  components: GenFunc.components,
  recentItem: {},

  createItemObj: function(food) {
    var newItemObj = {};
    newItemObj['name'] = food.description
    newItemObj['serving'] = {qty: '', label: '', eqv: '100', eunit: 'grams'}
    newItemObj['measurements'] = this.getOtherServingTypes(food.foodPortions)
    newItemObj['fdcId'] = food.fdcId;
    //Nutrients
    var partialItemObj = this.groupNutrientTypes(food.foodNutrients)
    partialItemObj = this.createVitaminMineralTemplate(partialItemObj)
    newItemObj['vitamins'] = partialItemObj.vitamins
    newItemObj['minerals'] = partialItemObj.minerals
    newItemObj['calories'] = partialItemObj.calories
    newItemObj['proteins'] = partialItemObj.proteins
    newItemObj['carbs'] = partialItemObj.carbs
    newItemObj['fats'] = partialItemObj.fats
    newItemObj['notUpdated'] = true;
    console.log(newItemObj);
    this.recentItem = newItemObj;
    return newItemObj;        
  },

  updateNutrientValues: function(newServingSize) {
    newServingSize = this.createServingSizeObj(newServingSize)
    this.components.forEach((group)=>{
      this.recentItem[group].forEach((n)=>{
        let total = (n.value/Number(this.recentItem.serving.eqv)) * Number(newServingSize.eqv)
        total = total.toFixed(2)
        n.value = total;
      })
    })
    this.updateServingSize(newServingSize)
    return this.recentItem;
  },

  createServingSizeObj: function(serving){
    console.log('createServingSizeObj', serving)
    let s = serving.split('?')
    let obj = {label: s[1], eqv: s[2], qty: s[0], eunit: 'grams'}
    console.log('createServingSizeObj after', obj)
    return obj
  },

  updateServingSize: function(newServingSize){
    console.log('updateServingSize', this.recentItem.serving)
    this.recentItem.measurements = this.recentItem.measurements.map((obj)=>{
      if(obj.eqv === Number(newServingSize.eqv)){
        return this.recentItem.serving
      }
      return obj;
    })
    console.log('updateServingSize After', this.recentItem.measurements)
    this.recentItem.serving = newServingSize
  },
  
  getOtherServingTypes: function(measurements) {
    console.log('getOtherServingTypes')
    return measurements.map((m)=>{
      let labelName = '';
      let quantity = 0
      if(m.portionDescription) {
        labelName = m.portionDescription
        quantity = "";
        if(labelName === "Quantity not specified") {
          labelName = ""
        }
      } else {
        labelName = m.modifier
        quantity = m.amount
      }
      return {label: labelName, eqv: m.gramWeight, qty: quantity, eunit: 'grams'}
    })
  },

  trimNutrientArr: function(nutrientsArr) {
    console.log('trimNutrientArr')
    return nutrientsArr.map((n)=>{
      return { "nutrient_id": Number(n.nutrient.number), "name": n.nutrient.name, "value": n.amount, "unit": n.nutrient.unitName }
    })
  },

  groupNutrientTypes: function(rawNutrientsArr) {
    console.log('groupNutrientTypes')
    let nutrientsArr = this.trimNutrientArr(rawNutrientsArr)
    let partialItemObj = {calories: [], proteins: [], carbs: [], fats: [], vitamins: [], minerals: []};
    //Nutrient Types
    let calories = [208];
    let proteins = [203];
    let carbs = [205, 291, 269]
    let fats = [204, 606, 645, 646];
    let mineralIds = this.minReferenceArr.map((obj)=>{return obj.id})
    let vitaminIds = this.vitReferenceArr.map((obj)=>{return obj.id})
     //Group by Nutrient Types
     nutrientsArr.forEach((nObj)=>{
      if (calories.includes(Number(nObj.nutrient_id))) {
        partialItemObj.calories.push(this.cleanUpNutrientName(nObj));
      }
      if (proteins.includes(Number(nObj.nutrient_id))) {
        partialItemObj.proteins.push(this.cleanUpNutrientName(nObj));
      }
      if (carbs.includes(Number(nObj.nutrient_id))) {
        partialItemObj.carbs.push(this.cleanUpNutrientName(nObj));
      }
      if (fats.includes(Number(nObj.nutrient_id))) {
        partialItemObj.fats.push(nObj);
      }
      if (vitaminIds.includes(Number(nObj.nutrient_id))) {
        partialItemObj.vitamins.push(this.cleanUpNutrientName(nObj));
      }
      if (mineralIds.includes(Number(nObj.nutrient_id))) {
        partialItemObj.minerals.push(this.cleanUpNutrientName(nObj));
      }
    })
    return partialItemObj;
  },

  cleanUpNutrientName: function(nObj) {
    var name = ''
    if (nObj.group === 'Lipids') {
      name = nObj.name.split(' ')[3];
      nObj.name = name.substring(0,1).toUpperCase() + name.substring(1) + ' Fat';
    } else {
      name = nObj.name.split(',')[0];
      name = name.split('(')[0];
      nObj.name = name;
    }
    return nObj;
  },

  createVitaminMineralTemplate: function(itemObj) {

    //Determine and create vitamin and mineral nutrient objects where the data 
    //isn't any data available
    itemObj.vitamins = this.setViTMinTemplate(itemObj.vitamins, 'vitamins');
    itemObj.minerals = this.setViTMinTemplate(itemObj.minerals, 'minerals');

    //Sort out the vitamins and minerals by alphabetic order
    itemObj.vitamins = this.sortNames(itemObj.vitamins);
    itemObj.minerals = this.sortNames(itemObj.minerals);  
    return itemObj;
  },

  setViTMinTemplate: function(nArr, type) {
    var ids = [];
    var missingNutrients = [];
    var queryNutrientIds = nArr.map((nObj)=>{return Number(nObj.nutrient_id)})
    // Create id array for type of nutrient
    if (type === 'vitamins') {
      ids = this.vitReferenceArr.map((obj)=>{return Number(obj.id)})
    }
    if (type === 'minerals') {
      ids = this.minReferenceArr.map((obj)=>{return Number(obj.id)})
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
      newNObj.nutrient_id = Number(this.vitReferenceArr[index].id)
      newNObj.name = this.vitReferenceArr[index].name
    }
    
    if (type === 'minerals') {
      newNObj.nutrient_id = Number(this.minReferenceArr[index].id)
      newNObj.name = this.minReferenceArr[index].name 
    }
    
    newNObj['unit'] = '';
    return newNObj;
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

  foodDetails: function(fdcId){
    let apiKey = GenFunc.usdaApiKey();
    let key = "api_key=" + apiKey
    let encodedPath = `https://api.nal.usda.gov/fdc/v1/${fdcId}?${key}`
    return GenFunc.usdaRequest(encodedPath)
  },

}