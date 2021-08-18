const mysql = require('mysql');
const configs = require('../../../infra/configs/global_config');

//local mysql db connection
const dbConn = mysql.createConnection({
  host : configs.get('/dbhost'),
  user : configs.get('/dbuser'),
  password : configs.get('/dbpassword'),
  database : configs.get('/database'),
});

dbConn.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = dbConn;
