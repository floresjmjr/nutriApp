var express = require('express');
var router = express.Router();
var path = require('path');
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
  Search.foodAPI(req.query.db, req.query.query).then((body)=>{
    console.log('get food items  to create categories')
    if (body.totalHits > 1) {
      Search.foodDatabase = body.foods;
      res.render('searchResults', { 
        searchTerm: body.foodSearchCriteria.query,
        categories: Search.createCategories(body.foods),
      });
      console.log('search results rendered')
    } else {
      res.render('searchResults', {error: true,searchTerm: req.query.query})
    }
  }).catch((err)=>{ console.log('Problemo!:', err) })
})

// GET Category items
router.get('/category/:category', function(req, res, next) {
  console.log('request for category', req.params.category);
  let category = req.params.category;
  res.render('groupList', {
    categoryName: category,
    itemList: Search.filterItemsByCategory(category),
  });
})


module.exports = router;
