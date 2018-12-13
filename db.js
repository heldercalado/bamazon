var mysql = require('mysql');
var dotEnv = require('dotenv').config();


class Database{

constructor(){
    this.connection = mysql.createConnection({
        host     : process.env.host ,
        user     : process.env.user,
        password : process.env.password,
        database :process.env.database
      });
      this.connection.connect();
      console.log("Connected");

}

getAllFromDatabase(){
    this.connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        console.log(results[0]);
      });
}
getItemFromDatabase(argName){
    this.connection.query('SELECT * FROM products WHERE product_name = ?',argName, function (error, results, fields) {
        if (error) throw error;
        console.log(results[0]);
      });
}
addItemToDatabase(argmyObj){
  

    this.connection.query('INSERT INTO products SET ?',argmyObj, function (error, results, fields) {
        if (error) throw error;
        console.log(argmyObj.product_name + " Added to Database");
      });
}
checkIfItemExists(argItem){
    this.connection.query('SELECT * FROM products WHERE product_name = ?',argItem.product_name, (error, results, fields)=> {
       
        if (error) throw error;
       // console.log(results);
        if (results.length > 0){
            console.log(argItem.product_name+" Already in Database");
           return true;
        }else {
            this.addItemToDatabase(argItem);
        }
            
      })
       
      
}
updateItemQuantity(argItem , argQuantity){
    this.connection.query('SELECT * FROM products WHERE product_name = ?',argItem, (error, results, fields)=> {
        var sql = "UPDATE products SET stock_quantity = stock_quantity - "+ argQuantity + " WHERE product_name = "+"'" +argItem+"'";
        //console.log(sql);
        if (error) throw error;
       
        if (results.length > 0){
            
            if (results[0].stock_quantity - argQuantity >= 0){
                this.connection.query(sql, (error, results, fields)=> {

                        console.log("Order placed!");
                })
            }else {
                console.log("Not Enough Items in stock for this order");
            }
           
        }
            
      })
       
      
}
}

module.exports = Database;