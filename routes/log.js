const express = require('express')
const router = express.Router();
const Log = require('../modules/log.js')

//  Get log main layout
router.get('/log', (req, res, next)=>{
  console.log('/log GET')
  Log.retrieveEntries().then((results)=>{
    console.log('/log GET inside promise', results.length)  
    res.render('./log/index', {
      entries: results,
    })
  }).catch((err)=>{ console.log(err)})
})

router.delete('/log/:id', (req, res, next)=>{
  console.log('/log DELETE', req.params.id)
  Log.deleteEntry(req.params.id).then((rObj)=>{
    console.log('/log DELETE inside promise', rObj.deletedCount)
    if (rObj.deletedCount === 1) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  }).catch((err)=>{ console.log('Problemo!:', err) })
})

module.exports = router;