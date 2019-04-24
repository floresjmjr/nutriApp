var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var Search = require(path.resolve(path.dirname(__dirname), './modules/search.js'))

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
    console.log(JSON.parse(body));
    var rawData = JSON.parse(body);
    if (rawData.errors) {
      res.render('searchResults', {
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





module.exports = router;
