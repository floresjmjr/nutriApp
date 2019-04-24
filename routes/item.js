var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var Item = require(path.resolve(path.dirname(__dirname), './modules/item.js'))
var Database = require(path.resolve(path.dirname(__dirname), './modules/database.js'))


var recentItem = {};

// GET Item details
router.get('/item/:ndbno', function(req, res, next) {
  console.log('request for item');
  var ndbnoId = req.params.ndbno;
  console.log(ndbnoId);
  var encodedPath = `https://api.nal.usda.gov/ndb/reports/?ndbno=${ndbnoId}&type=f&format=json&api_key=otG2SftWm3WXimTE3iX2OznAWtnHaCB7spWhwEjo`
  request(encodedPath, (error, response, body)=>{
    if(error){console.error(error)}
    var rawData = JSON.parse(body);
    recentItem = Item.createItemObj(rawData.report.food, ndbnoId)
    console.log('itemName', recentItem.name);
    res.render('breakdown', {
      addFood: true,
      item: recentItem,
    });
  });
})

// POST request for logging food
router.post('/item/:ndbno', (req, res, next)=>{
  console.log('add item', req.body.qty);
  recentItem['qty'] = req.body.qty;
  Database.insertEntry(recentItem).then((rObj)=>{
    // console.log('returned object :', rObj);
    // Needs a more appropriate way to valid that an entry was made
    if(rObj){
      res.sendStatus(200);
      console.log('post was successful')
    } else {
      res.sendStatus(500)
    }
  })
})

// Update request for getting new serving data
router.get('/serving', (req, res, next)=>{
  console.log('GET serving', req.query)
  recentItem = Item.updateItem(recentItem, req.query.serving)
  res.render('breakdown', {
    addFood: true,
    item: recentItem,
  });
})



module.exports = router;
