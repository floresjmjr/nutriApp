var GenFunc = require('./_community')


module.exports = {

  createTotals: function(entries) {
    console.log('createTotals')
    var entriesTotal = {};
    GenFunc.components.forEach((group)=>{
      entriesTotal[group] = this.calculateTotals(entries, group)
    })
    console.log(entriesTotal)
    return entriesTotal;
  },

  calculateTotals: function(entries, group) {
    console.log('calculateTotals')
    var totalData = [];    //this can be just an array, above its an object
    entries.forEach((item)=>{
      item[group].forEach((nutrient, idx)=>{
        if (totalData[idx] === undefined){
          totalData[idx] = {};
          totalData[idx].name = nutrient.name;
          totalData[idx].nutrient_id = nutrient.nutrient_id;
          totalData[idx].unit = nutrient.unit
          totalData[idx].value = 0
        }

        if (Number.isNaN(Number(nutrient.value))) {
        } else {
          totalData[idx].value += nutrient.value;
        }
      })
    })
    return totalData;
  },
  
}


