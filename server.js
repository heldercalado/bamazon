var express = require('express');

var dotEnv = require('dotenv').config();
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));
var Database = require("./db.js");

var db = new Database();

// route pages
app.get('/', function (req, res) {
  
  db.connection.query("SELECT * FROM products WHERE stock_quantity > 0 LIMIT 10", function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      //console.log(results);
      res.render('index', {
        items: results,
        err: ""
      });

    } else {
      res.render('index', {
        items: "",
        err: "nothing found"
      });
    }

  });



});

app.get('/searchresults', function (req, res) {
  
  var check = req.query.name;
  // console.log(check);
  if (check) {
    db.connection.query('SELECT * FROM products WHERE product_name LIKE ?', "%" + check + "%", function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        res.render('searchresults', {
          items: results,
          err: ""
        });
      } else {
        res.render('index', {
          items: "",
          err: "nothing found"
        });
      }
    });



  } else {
    res.render('index', {
      items: "",
      err: "nothing found"
    });
    console.log("Nothing Found");
  }
});
app.get('/department', function (req, res) {
  
  var check = req.query.name;
  console.log(check);
  if (check) {
    db.connection.query('SELECT * FROM products WHERE department_name LIKE ? AND stock_quantity > 0', "%" + check + "%", function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        res.render('department', {
          items: results,
          err: ""
        });
      } else {
        res.render('index', {
          items: "",
          err: "nothing found"
        });
      }
    });



  } else {
    res.render('index', {
      items: "",
      err: "nothing found"
    });
    console.log("Nothing Found");
  }
});
app.get('/itemsmanagement', function (req, res) {
  
  db.connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      res.render('itemsmanagement', {
        results: results,
        err: ""
      });
    }
  });

});
app.post('/getcartid', function (req, res) {
  
  var obj = {
    date_field:new Date()
  }
  sql ='INSERT INTO cart (date_field) values ("'+ obj.date_field + '")'
 
  db.connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    
    res.send(results);
    
  });

});
app.get('/getitem', function (req, res) {
  
  var check = req.query.id;
  db.connection.query('SELECT * FROM products WHERE id = ?', check, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {

      var item = {
        id: results[0].id,
        product_name: results[0].product_name,
        department_name: results[0].department_name,
        price: results[0].price,
        stock_quantity: results[0].stock_quantity,
        picture_link: results[0].picture_link,
        product_description: results[0].product_description

      }

      res.json(item);
    }
  });

});
app.post('/setitem', function(req, res) {
  
  var item = {
    
    product_name: req.body.product_name,
    department_name: req.body.department_name,
    price: req.body.price,
    stock_quantity: req.body.stock_quantity,
    picture_link: req.body.picture_link,
    product_description: req.body.product_description

  }
  
sql = "UPDATE products SET ? WHERE id =" +  req.body.id;
console.log(sql);
  console.log(item);
  db.connection.query(sql,[item], function (error, results, fields) {
    if (error) throw error;
    myres = {
      status:"ok"
    }
    
    res.json(myres);
  });

  
});
app.post('/additem', function(req, res) {
  
  var item = {
    
    product_name: req.body.product_name,
    department_name: req.body.department_name,
    price: req.body.price,
    stock_quantity: req.body.stock_quantity,
    picture_link: req.body.picture_link,
    product_description: req.body.product_description

  }
  
sql = 'INSERT INTO products SET ?';
console.log(sql);
console.log(item); 
  db.connection.query(sql,[item], function (error, results, fields) {
    if (error) throw error;
    myres = {
      status:"ok"
    }
    
    res.json(myres);
  });

  
});
app.post('/deleteitem', function(req, res) {
  
  
  
sql = "DELETE FROM products WHERE id =" +  req.body.id;
console.log(sql);
  
  db.connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    myres = {
      status:"ok"
    }
    
    res.json(myres);
  });

  
});
// what port to run server on
app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});