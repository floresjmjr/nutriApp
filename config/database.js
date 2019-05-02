// const Password = require('../passwords/database')

// Database
const MongoClient = require('mongodb').MongoClient;
// const url = `mongodb+srv://floresjmjr:${password}@cluster0-iw5gt.mongodb.net/test?retryWrites=true`;
const mOptions = {useNewUrlParser: true}
const dbName = 'test';

var db = {};

function connect() {
  MongoClient.connect(process.env.DATABASE_PASS, mOptions, (err, client)=>{
    if (err) { console.error('An error occurred connecting to database: ', err)
    } else {
      
      async function runTransactionWithRetry(txnFunc, client, session) {
        try {
          await txnFunc(client, session);
          console.log('Connected successfully to server')
          db = client.db(dbName)
        } catch (error) {
          console.log('Transaction aborted. Caught exception during transaction.');
      
          // If transient error, retry the whole transaction
          if (error.errorLabels && error.errorLabels.indexOf('TransientTransactionError') >= 0) {
            console.log('TransientTransactionError, retrying transaction ...');
            await runTransactionWithRetry(txnFunc, client, session);
          } else {
            throw error;
          }
        }
      }
    }
  })
}

function getDB(){
  return db;
}

module.exports = {getDB, connect}
