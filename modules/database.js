// Database
const DB = require('../config/database.js')
const ObjectID = require('mongodb').ObjectID;

// Log properties
module.exports = {

  insertEntry: function(foodItem) {
    return DB.getDB().collection('documents').insertOne(foodItem);
  },

  retrieveEntries: function(){
    return DB.getDB().collection('documents').find({},{name: true}).toArray()
  },

  deleteEntry: function(entryId) {
    // console.log('deleteEntry', entryId);
    //Object id object
    return DB.getDB().collection('documents').deleteOne({"_id" : ObjectID(entryId)})
  }
}

