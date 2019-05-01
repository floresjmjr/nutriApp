var express = require('express');
var router = express.Router();
var path = require('path');
var Item = require(path.resolve(path.dirname(__dirname), './modules/item.js'))
var Database = require(path.resolve(path.dirname(__dirname), './modules/database.js'))


var recentItem = {};

// GET Item details
router.get('/item/:ndbno', function(req, res, next) {
  console.log('request for item');
  Item.getDetailsByNdbno(req.params.ndbno).then((body)=>{
    res.render('breakdown', {
      addFood: true,
      item: Item.createItemObj(body.report.food, req.params.ndbno),
    });
  });
})

// POST request for logging food
router.post('/item/:ndbno', (req, res, next)=>{
  console.log('add item', req.body.qty);
  Item.recentItem['qty'] = req.body.qty;
  Database.insertEntry(Item.recentItem).then((rObj)=>{
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
  console.log('serving GET', req.query)
  res.render('breakdown', {
    addFood: true,
    item: Item.updateItem(req.query.serving),
  });
})



module.exports = router;
