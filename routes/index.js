var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var Search = require(path.resolve(path.dirname(__dirname), './modules/search.js'))
var Item = require(path.resolve(path.dirname(__dirname), './modules/item.js'))

// GET Home page
router.get('/', function(req, res, next) {
  console.log('redirect to search');
  res.redirect('/search');
});

// GET Search Page
router.get('/search', function(req, res, next) {
  console.log('request for search page')
  res.render('searchLayout');
})

// GET Results
router.get('/search/results', function(req, res, next) {
  console.log('request for results');
  var encodedDB = req.query.db === 'SR' ? 'Standard%20Reference' : 'Branded%20Food%20Products'
  var encodedQuery = encodeURIComponent(req.query.query);
  var encodedPath = `https://api.nal.usda.gov/ndb/search/?format=json&q=${encodedQuery}&ds=${encodedDB}&sort=n&max=500&offset=0&api_key=otG2SftWm3WXimTE3iX2OznAWtnHaCB7spWhwEjo`
  request(encodedPath, (error, response, body)=>{
    if(error){console.error(error)}
    var rawData = JSON.parse(body);
    if (rawData.errors) {
      res.render('results', {
        error: true,
        searchTerm: req.query.query,
      })
    } else {
      console.log('term: ', rawData.list.q);
      console.log('total:', rawData.list.total)
      console.log('end:', rawData.list.end);
      console.log('count:', rawData.list.item.length)
      var categories = Search.createCategories(rawData.list.item);
      console.log('foodGroups', categories);
      res.render('searchResults', { 
        selection: '',
        searchTerm: rawData.list.q,
        categories: categories,
      });
    }
  });
})

// GET Category items
router.get('/category/:id', function(req, res, next) {
  console.log('request for category');
  var id = req.params.id;
  var categoryObj = Search.getItemsByCatId(id)
  res.render('groupList', {
    category: categoryObj,
  });
})

// GET Item details
router.get('/item/:ndbno', function(req, res, next) {
  console.log('request for item');
  var ndbnoId = req.params.ndbno;
  console.log(ndbnoId);
  var encodedPath = `https://api.nal.usda.gov/ndb/reports/?ndbno=${ndbnoId}&type=f&format=json&api_key=otG2SftWm3WXimTE3iX2OznAWtnHaCB7spWhwEjo`
  request(encodedPath, (error, response, body)=>{
    if(error){console.error(error)}
    var rawData = JSON.parse(body);
    var itemObj = Item.createItemObj(rawData.report.food)
    console.log('itemName', rawData.report.food.name);
    res.render('breakdown', {
      item: itemObj,
    });
  });
})

router.get('/nutrient', (req, res, next)=>{
  console.log('request for nutrient lookup')
  var nutrientsArr = (Item.vitReferenceArr).concat(Item.minReferenceArr)
  res.render('nutrientLayout', {
    nutrients: nutrientsArr,
  })
})

router.get('/nutrient/results', (req, res, next)=>{
  console.log('request for nutrient lookup')
  var encodedPath = `https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=otG2SftWm3WXimTE3iX2OznAWtnHaCB7spWhwEjo&nutrients=${req.query.nutrient}&sort=c&max=35`
  request(encodedPath, (error, response, body)=>{
    var rawData = JSON.parse(body);
    var itemsArrObj = rawData.report.foods
    var nutrientName = itemsArrObj[0].nutrients[0].nutrient
    res.render('nutrientResults', {
      nutrientName: nutrientName,
      items: itemsArrObj,
    })
  })
})



module.exports = router;
