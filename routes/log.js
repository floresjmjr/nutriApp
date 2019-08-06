const express = require('express')
const router = express.Router();
const Database = require('../modules/database.js')
const Analysis = require('../modules/analysis.js')

//  Get log main layout
router.get('/log', (req, res, next)=>{
  // console.log('/log GET')
  Database.retrieveEntries().then((results)=>{
    if(results.length) {
      // console.log('results retrieved', results[0])  
      var totals = Analysis.createTotals(results);
    } else {
      results = false;
      totals = false;
    }
      res.render('./log/index', {
      totals: totals,
      entries: results,
    })
  }).catch((err)=>{ console.log(err)})
})

router.delete('/log/:id', (req, res, next)=>{
  // console.log('/log DELETE', req.params.id)
  Database.deleteEntry(req.params.id).then((rObj)=>{
    // console.log('/log DELETE inside promise', rObj.deletedCount)
    if (rObj.deletedCount === 1) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  }).catch((err)=>{ console.log('Problemo!:', err) })
})

module.exports = router;