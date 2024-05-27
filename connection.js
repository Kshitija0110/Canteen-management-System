// var {createPool}=require ('mysql');
// var pool=createPool({
// host:"localhost",
// user:"root",
// password:"root",
// database:"kshitu",
// connectionLimit:10

// });
// module.exports=pool;

var mysql=require("mysql");
var con=mysql.createConnection({
host:"localhost",
user:"root",
password:"root",
database:"kshitu"
});

module.exports=con;
//To run on chrome ,use localhost:5500