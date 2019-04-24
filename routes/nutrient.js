const express = require('express');
const router = express.Router();
const path = require('path')
const request = require('request');
const Nutrient = require(path.resolve(path.dirname(__dirname), './modules/nutrient.js'))



// Get Nutrient Search Page
router.get('/nutrient', (req, res, next)=>{
  console.log('request for nutrient lookup')
  res.render('nutrientLayout', {
    nutrients: Nutrient.createNutrientList(),
  })
})

// Get Nutrient Results Page
router.get('/nutrient/results', (req, res, next)=>{
  console.log('request for nutrient lookup')
  var encodedPath = `https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=otG2SftWm3WXimTE3iX2OznAWtnHaCB7spWhwEjo&nutrients=${req.query.nutrient}&sort=c&max=75`
  request(encodedPath, (error, response, body)=>{
    var rawData = JSON.parse(body);
    // console.log('rawData foods', rawData.report.foods);
    var itemsArrObj = Nutrient.filterNformat(rawData.report.foods)
    var nutrientName = itemsArrObj[0].nutrients[0].nutrient
    res.render('nutrientResults', {
      nutrientName: nutrientName,
      items: itemsArrObj,
    })
  })
})

module.exports = router;

