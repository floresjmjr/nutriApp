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

var GenFunc = require('./_community');

module.exports = {

  vitReferenceArr: GenFunc.vitReferenceArr,
  minReferenceArr: GenFunc.minReferenceArr,
  components: GenFunc.components,

  createItemObj: function(rawObj, ndbno) {
    var newItemObj = {};
    newItemObj['name'] = GenFunc.cleanName(rawObj.name)
    newItemObj['serving'] = {qty: '', label: '', eqv: '100', eunit: rawObj.ru}
    newItemObj['measurements'] = this.reCreateMeasurements(rawObj.nutrients[0].measures)
    newItemObj['ndbno'] = ndbno;
    //Nutrients
    var partialItemObj = this.groupNutrientTypes(rawObj.nutrients)
    partialItemObj = this.reCreateItemObj(partialItemObj)
    newItemObj['vitamins'] = partialItemObj.vitamins
    newItemObj['minerals'] = partialItemObj.minerals
    newItemObj['calories'] = partialItemObj.calories
    newItemObj['proteins'] = partialItemObj.proteins
    newItemObj['carbs'] = partialItemObj.carbs
    newItemObj['fats'] = partialItemObj.fats
    newItemObj['notUpdated'] = true;
    console.log(newItemObj);
    return newItemObj;        
  },

  updateItem: function(item, newServing) {
    if(item.notUpdated) {
      item = this.createDefaultMeasure(item)
      item.notUpdated = false;
    }
    var selectedServingObj = this.formatServing(newServing)
    this.uniqueServings(item, selectedServingObj)
    return this.replaceServingValues(item);
  },

  uniqueServings: function(item, selectedServing) {
    console.log('uniqueServings', item.serving, selectedServing)
    //Adds previous serving
    item.measurements.push(item.serving);
    var index;
    item.measurements.forEach((m, idx)=>{
      if (String(m.eqv) === String(selectedServing.eqv)) {
        console.log('match')
        index = idx;
      }
    })
    item.measurements.splice(index, 1);
    item.serving = selectedServing;
  },

  formatServing: function(serving) {
    if (typeof(serving) === 'object') {
      return serving
    } else {
      var splitStr = serving.split('? ')
      return {qty: splitStr[0], label: splitStr[1], eqv: splitStr[2], eunit: splitStr[3]}
    }
  },

  createDefaultMeasure: function(item) {
    console.log('createDefaultMeasure')
    this.components.forEach((group)=>{
      item[group] = this.updateNutrients(item, group)
    })
    return item;
  },

  updateNutrients: function(item, group) {
    console.log('updateNutrients')
    return item[group].map((nutrient)=>{
      if(!nutrient.measures) {
        nutrient['measures'] = [];
      }
      nutrient.measures.unshift({qty: '', label: '', eqv: 100, eunit: 'g', value: nutrient.value})
      return nutrient;
    })      //*** value must be number
  },

  replaceServingValues: function(item) {
    console.log('replaceServingValues', item.serving)
    this.components.forEach((group)=>{
      item[group].forEach((nutrient)=>{
        if (nutrient.unit){
          nutrient.value = this.findMeasureValue(nutrient, item.serving.eqv)
        }
      })
    })
    console.log('after replaced', item.minerals[0].measures);
    console.log('replaced!', item)
    return item;
  },

  findMeasureValue(nutrient, amount) {
    var value;
    nutrient.measures.forEach((measurement)=>{
      if(Number(measurement.eqv) === Number(amount)) {
        value = measurement.value;
      }
    })
    return value;
  },

  reCreateMeasurements: function(measurements) {
    return measurements.map((m)=>{
      return {label: m.label, eqv: m.eqv, qty: m.qty, eunit: m.eunit}
    })
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

    //Determine and create vitamin and mineral nutrient objects where the data 
    //isn't any data available
    itemObj.vitamins = this.setViTMinTemplate(itemObj.vitamins, 'vitamins');
    itemObj.minerals = this.setViTMinTemplate(itemObj.minerals, 'minerals');

    //Remove extra properties from nutrient object
    this.components.forEach((group)=>{
      itemObj[group] = this.trimNutrientData(itemObj[group])
    })

    //Sort out the vitamins and minerals by alphabetic order
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

  trimNutrientData: function(nutrients) {
    return nutrients.map((n)=>{
      return {nutrient_id: n.nutrient_id, name: n.name, group: n.group, unit: n.unit, value: n.value, measures: n.measures}
    })
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

}