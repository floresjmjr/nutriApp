var express = require('express');
var router = express.Router();
var path = require('path');
var Database = require(path.resolve(path.dirname(__dirname), './modules/database.js'))
var Analysis = require(path.resolve(path.dirname(__dirname), './modules/analysis.js'))

router.get('/analysis', (req, res, next)=>{
  Database.retrieveEntries().then((queryResults)=>{
    res.render('breakdown', {
      addFood: false,
      totals: true,
      item: Analysis.createTotals(queryResults),
    })
  }).catch((error)=>{ console.log(error) })
})

module.exports = router;