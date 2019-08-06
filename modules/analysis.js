var GenFunc = require('./_community')


module.exports = {

  createTotals: function(entries) {
    var entriesTotal = {};
    GenFunc.components.forEach((group)=>{
      entriesTotal[group] = this.calculateTotals(entries, group)
    })
    // console.log(entriesTotal)
    return entriesTotal;
  },

  calculateTotals: function(entries, group) {
    // console.log('calculateTotals', entries[0].name, entries[0].qty)
    var totalData = [];    //this can be just an array, above its an object
    entries.forEach((item)=>{
      item[group].forEach((nutrient, idx)=>{
        if (totalData[idx] === undefined){
          totalData[idx] = {};
          totalData[idx].value = 0
          totalData[idx].name = nutrient.name;
          totalData[idx].nutrient_id = nutrient.nutrient_id;
        }
        if (Number.isNaN(Number(nutrient.value) || nutrient.value === 'unk')) {
        } else {
          totalData[idx].unit = nutrient.unit

          var total = Number(nutrient.value) * Number(item.qty)
          totalData[idx].value += total;
        }
      })
    })
    return totalData;
  },



}


