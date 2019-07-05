var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'psspl1!',
    database : 'node_store_locator'
});

connection.connect(function(err){
    if(err) throw err;
    
    console.log("Mysql database Connected!");
});

module.exports = {mysql, connection};
