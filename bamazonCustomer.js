
var dotEnv = require('dotenv').config();
var Database = require('./db');
var mysql      = require('mysql');

db = new Database(); 


var myObj = {
    product_name:"Alexa Echo" ,
    department_name:"Electronics" ,
    price:12.50,
    stock_quantity:20
}


//db.checkIfItemExists(myObj);

//db.updateItemQuantity("Alexa Echo" , 10);

