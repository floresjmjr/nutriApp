// Database
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb+srv://floresjmjr:${process.env.DATABASE_PASSWORD}@cluster0-iw5gt.mongodb.net/test?retryWrites=true`;
const mOptions = {useNewUrlParser: true}
const dbName = 'test';

var db = {};

function connect() {
  MongoClient.connect(url, mOptions, (err, client)=>{
    if (err) { console.error('An error occurred connecting to database: ', err)
    } else {
      
      console.log('Connected successfully to server')
      db = client.db(dbName)

    }
  })
}

function getDB(){
  return db;
}

module.exports = {getDB, connect}
