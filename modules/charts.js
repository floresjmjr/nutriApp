
module.exports = {

  calculatePercentages: function(allGroups) {
    this.addDailyValues(allGroups['vitamins'])
    this.addDailyValues(allGroups['minerals'])
  },

  addDailyValues: function(data){
    data.forEach((n)=>{
      n['dv'] = this.calculateDailyValue(n)
    })  
  },

  calculateDailyValue: function(nutrient) {
    switch (Number(nutrient.nutrient_id)) {
      case 421:
        return this.calculateDV(nutrient.value, 550);
      case 417:
        return this.calculateDV(nutrient.value, 400);
      case 406:
        return this.calculateDV(nutrient.value, 16);
      case 410:
        return this.calculateDV(nutrient.value, 5);
      case 405:
        return this.calculateDV(nutrient.value, 1.3);
      case 404:
        return this.calculateDV(nutrient.value, 1.2);
      case 320:
        return this.calculateDV(nutrient.value, 900);
      case 418:
        return this.calculateDV(nutrient.value, 2.4);
      case 415:
        return this.calculateDV(nutrient.value, 1.7);
      case 401:
        return this.calculateDV(nutrient.value, 90);
      case 328:
        return this.calculateDV(nutrient.value, 20);
      case 323:
        return this.calculateDV(nutrient.value, 15);
      case 430:
        return this.calculateDV(nutrient.value, 120);
      case 301:
        return this.calculateDV(nutrient.value, 1300);
      case 312:
        return this.calculateDV(nutrient.value, .9);
      case 303:
        return this.calculateDV(nutrient.value, 18);
      case 304:
        return this.calculateDV(nutrient.value, 420);
      case 315:
        return this.calculateDV(nutrient.value, 2.3);
      case 305:
        return this.calculateDV(nutrient.value, 1250);
      case 306:
        return this.calculateDV(nutrient.value, 4700);
      case 317:
        return this.calculateDV(nutrient.value, 55);
      case 309:
        return this.calculateDV(nutrient.value, 11);
      case 307:
        return this.calculateDV(nutrient.value, 2400);
      default: 
        return '~';
    }

  },

  calculateDV: function(value, total) {
    if(typeof(Number(value)) === 'number' && (!isNaN(Number(value)))) {
      return Number(((value / total)*100).toFixed())
    } else {
      return '~';
    }
  },

  getMacros: function(allGroups) {
    let macroNames = ['proteins', 'carbs', 'fats']
    this.totalMacroCalories = 0;
    this.macros = macroNames.map((name)=>{
      const obj = {}
      obj['value'] = allGroups[name][0].value.toFixed();
      obj['name'] = name[0].toUpperCase() + name.substring(1);
      return obj;
    })
    this.findTotalMacroCalories();
    this.addMacroPercentages();
    allGroups['macros'] = this.macros;
  },

  findTotalMacroCalories: function() {
    this.macros.forEach((obj)=>{
      if(obj.name === 'Fats'){
        this.totalMacroCalories += obj.value * 9;
      } else {
        this.totalMacroCalories += obj.value * 4;
      }
    })
  },

  addMacroPercentages: function(){
    console.log('total', this.totalMacroCalories);
    this.macros.forEach((obj)=> {
      if(obj.name === 'Fats'){
        let percent = ((obj.value * 9) / this.totalMacroCalories) * 100;
        obj['percentage'] = percent.toFixed(1)
      } else {
        let percent = ((obj.value * 4) / this.totalMacroCalories) * 100;
        obj['percentage'] = percent.toFixed(1);
      }
    })
  }


}