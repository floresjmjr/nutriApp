var express = require('express');
var router = express.Router();
var path = require('path');
var Database = require(path.resolve(path.dirname(__dirname), './modules/database.js'))
var Analysis = require(path.resolve(path.dirname(__dirname), './modules/analysis.js'))

router.get('/analysis', (req, res, next)=>{
  Database.retrieveEntries().then((queryResults)=>{
    if(queryResults.length) {
      var item = Analysis.createTotals(queryResults)
    } else {
      var item = false;
    }
    res.render('analysis', {
      addFood: false,
      totals: true,
      item: item,
    })
  }).catch((error)=>{ console.log(error) })
})

module.exports = router;