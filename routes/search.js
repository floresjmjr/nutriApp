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
  Search.getCategories(req.query.db, req.query.query).then((body)=>{
    if (body.errors) {
      res.render('searchResults', {error: true,searchTerm: req.query.query})
    } else {
      res.render('searchResults', { 
        searchTerm: body.list.q,
        categories: Search.createCategories(body.list.item),
      });
    }
  }).catch((err)=>{ console.log('Problemo!:', err) })
})

// GET Category items
router.get('/category/:id', function(req, res, next) {
  console.log('request for category');
  var id = req.params.id;
  res.render('groupList', {
    category: Search.getItemsByCatId(id),
  });
})


module.exports = router;
