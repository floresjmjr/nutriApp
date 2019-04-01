var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var Search = require(path.resolve(path.dirname(__dirname), './modules/search.js'))
var Item = require(path.resolve(path.dirname(__dirname), './modules/item.js'))

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('redirect to search');
  res.redirect('/search');
});

router.get('/search', function(req, res, next) {
  console.log('request for search page')
  res.render('searchLayout');
})

router.get('/search/results', function(req, res, next) {
  console.log('request for results');
  var encodedQuery = encodeURIComponent(req.query.query);
  var encodedPath = `https://api.nal.usda.gov/ndb/search/?format=json&q=${encodedQuery}&ds=Standard%20Reference&sort=n&max=500&offset=0&api_key=otG2SftWm3WXimTE3iX2OznAWtnHaCB7spWhwEjo`
  request(encodedPath, (error, response, body)=>{
    if(error){console.error(error)}
    var rawData = JSON.parse(body);
    var foodGroups = Search.createFoodGroups(rawData.list.item);
    console.log('term: ', rawData.list.q);
    res.render('results', { 
      selection: '',
      searchTerm: rawData.list.q,
      foodGroups: foodGroups,
    });
  });
})

router.get('/selection/:id', function(req, res, next) {
  console.log('request for selection');
  var id = req.params.id;
  var foodList = Search.getFoodGroupById(id)
  res.render('groupList', {
    list: foodList,
  });
})

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

module.exports = router;
