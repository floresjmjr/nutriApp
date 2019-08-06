const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require(path.resolve(path.dirname(__dirname), './modules/database.js'))
const Analysis = require(path.resolve(path.dirname(__dirname), './modules/analysis.js'))
const Chart = require(path.resolve(path.dirname(__dirname), './modules/charts.js'))

router.get('/userTotals', (req, res, next)=>{
  Database.retrieveEntries().then((queryResults)=>{
    if(queryResults.length) {
      var item = Analysis.createTotals(queryResults);
      Chart.calculatePercentages(item);
      Chart.getMacros(item);
      console.log('item', item);
      res.send(item);
    }
  }).catch((error)=>{ console.log(error) })
})

module.exports = router;