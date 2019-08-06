const express = require('express');
const router = express.Router();
const path = require('path')
const Nutrient = require(path.resolve(path.dirname(__dirname), './modules/nutrient.js'))


// Get Nutrient Search Page
router.get('/nutrient', (req, res, next)=>{
  // console.log('request for nutrient lookup')
  res.render('nutrientLayout', {
    nutrients: Nutrient.createNutrientList(),
  })
})

// Get Nutrient Results Page
router.get('/nutrient/results', (req, res, next)=>{
  // console.log('request for nutrient lookup', req.query.nutrient)
  Nutrient.getFoodListByNutrient(req.query.nutrient).then((body)=>{
    res.render('nutrientResults', {
      nutrientName: Nutrient.findNameById(req.query.nutrient),
      items: Nutrient.filterNformat(body.report.foods),
    })
  }).catch((err)=>{ console.log('Problemo!:', err) })
})

module.exports = router;

