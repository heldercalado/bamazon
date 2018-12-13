var express = require('express');

var dotEnv = require('dotenv').config();
var path = require('path');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));
var Database = require("./db.js");

var db = new Database();








// route pages
app.get('/', function (req, res) {
  db.connection.query("SELECT * FROM products LIMIT 10" , function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0){
      console.log(results);
    res.render('index',{items: results , err:""});
   
  }else {
    res.render('index', {items: "",err:"nothing found"});
  }
  
});
  
  
  
});

app.get('/searchresults', function (req, res) {
    var check = req.query.name;
    console.log(check);
    if (check) {
      db.connection.query('SELECT * FROM products WHERE product_name LIKE ?',"%"+check +"%", function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0){
        res.render('searchresults',{items: results , err:""});
      }else {
        res.render('index', {items: "" ,err:"nothing found"});
      }
      });   
             
            
    
    } else {
      res.render('index', {items: "" , err:"nothing found"});
      console.log("Nothing Found");
    }
  });
  app.get('/department', function (req, res) {
    var check = req.query.name;
    console.log(check);
    if (check) {
      db.connection.query('SELECT * FROM products WHERE department_name LIKE ?',"%"+check +"%", function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0){
        res.render('department',{items: results , err:""});
      }else {
        res.render('index', {items: "" ,err:"nothing found"});
      }
      });   
             
            
    
    } else {
      res.render('index', {items: "" , err:"nothing found"});
      console.log("Nothing Found");
    }
  });
  
 

// what port to run server on
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});