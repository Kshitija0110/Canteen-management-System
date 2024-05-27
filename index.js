var con=require('./connection');
var mysql=require("mysql");
var express =require('express');
const app = express();
const path = require('path');  
var bodyParser=require('body-parser');
var session = require('express-session');

app.use(session({
  secret: 'your secret',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended:true}));
app.set('views', 'D:/DBMS PROJECT/views');
app.set('view engine','ejs');

app.use('/assets',express.static('assets'));




app.get('/',function(req,res) {
res.sendFile(__dirname+'/register.html');

});
app.get('/admin',function(req,res) {
  res.sendFile(__dirname+'/admin_hp.html');
  
  });
 



app.get('/home',function(req,res){
  res.sendFile(__dirname+'/Homepage.html');
})

app.get('/newcategory',function(req,res){
  res.sendFile(__dirname+'/Categories.html');
})


app.get('/login', (req, res) => {   
    //For going to login page after clicking login button
     console.log('Button clicked!');
  res.sendFile(__dirname+'/login.html');  
});




app.get('/fp', (req, res) => {   
  //For going to Forgot Password page after clicking login button
res.sendFile(__dirname+'/ForgotPassword.html');  
});

app.get('/yes', (req, res) => {   
  //For going to Forgot Password page after clicking login button
  console.log("Hi yes");
res.sendFile(__dirname+'/yes.html');  
});




// Define a route to fetch data and render the HTML page
app.get('/graph', (req, res) => {
    const query = ' SELECT p.C_Name AS category, COUNT(*) AS count FROM orderHistory o INNER JOIN Products p ON o.product_name = p.product_name GROUP BY p.C_Name';
    con.query(query, (err, result) => {
        if (err) throw err;
        var data = result.map(row => ({ label: row.category, value: row.count }));
        res.render(__dirname+"/graph", { data:JSON.stringify(data) });
    });
});

// app.get('/admin_hp', (req, res) => {
//   const query = ' SELECT p.C_Name AS category, COUNT(*) AS count FROM orders o INNER JOIN Products p ON o.product_name = p.product_name GROUP BY p.C_Name';
//   con.query(query, (err, result) => {
//       if (err) throw err;
//       var data = result.map(row => ({ label: row.category, value: row.count }));
//       console.log("mydata:",data);
//       res.render("/admin_hp", { data:JSON.stringify(data) });
//   });
// });





//For chinese add button
app.get('/add_chinese', (req, res) => {

  console.log(x);
   console.log(y);
  const productid = req.query.id_chinese;
  console.log(productid);
  const cname=req.query.Chinese_name;

  console.log(productid);

  if (req.session.Chinese_count[productid]) {
    req.session.Chinese_count[productid]++;
  } else {

    req.session.Chinese_count[productid] = 1;

  }
  

console.log(x);
console.log(y);
  var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
  con.query(signupSql,[x,y], function(error, signupResult) {
    if (error) {
        console.log(error);
        return res.status(500).send("Error fetching signup data");
    }

    console.log(signupResult);
    console.log(signupResult[0].Name);

    const signupName = signupResult[0].Name;
    const signupPhone = signupResult[0].Mobile_No;
    
    const Timing = signupResult[0].timestamp;
    console.log(signupName);
    console.log(signupPhone);
    console.log(Timing);
    
    const signupAddress = signupResult[0].Address;
        


     var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
     con.query(productCostSql, [productid], function(error, costResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error fetching product cost");
         }
 
         var productCost = costResult[0].cost;

    
    var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP(),?)";
    con.query(orderSql, [signupName,signupPhone,signupAddress,productid,cname,productCost], function(error, orderResult) {
        if (error) {
            console.log(error);
            return res.status(500).send("Error inserting order data");
        }


        res.redirect('/chinese');
    });
});
});
});


//for pizza add
app.get('/pizza_add', (req, res) => {
  // Get the product id from the query parameters
  
 const productId = req.query.id_pizza;
 const Cname=req.query.pizza_name;
  
 if (req.session.pizza_count[productId]) {
  req.session.pizza_count[productId]++;
} else {
  req.session.pizza_count[productId] = 1;
}
  //Execute the first query
  var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
  con.query(signupSql,[x,y], function(error, signupResult) {
    if (error) {
        console.log(error);
        return res.status(500).send("Error fetching signup data");
    }

    // Get the result from the first query
    const signupName = signupResult[0].Name;
    const signupPhone = signupResult[0].Mobile_No;
    const Timing = signupResult[0].timestamp;
    const signupAddress = signupResult[0].Address;

    // Execute the query to get the cost of the product
    var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
    con.query(productCostSql, [productId], function(error, costResult) {
        if (error) {
            console.log(error);
            return res.status(500).send("Error fetching product cost");
        }
    const productCost = costResult[0].cost;
        
    // Execute the second query
    var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,?,?)";
    con.query(orderSql, [signupName,signupPhone,signupAddress,productId,Cname,Timing,productCost], function(error, orderResult) {
        if (error) {
            console.log(error);
            return res.status(500).send("Error inserting order data");
        }

        // Redirect the user back to the Chinese page
        res.redirect('/pizza');
    });
});
});
});



//for burger add
app.get('/burger_add', (req, res) => {
  
  const productId = req.query.id_burger;
  const Cname=req.query.burger_name;
   
  if (req.session.burger_count[productId]) {
   req.session.burger_count[productId]++;
 } else {
   req.session.burger_count[productId] = 1;
 }
   //Execute the first query
   var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
   con.query(signupSql,[x,y], function(error, signupResult) {
     if (error) {
         console.log(error);
         return res.status(500).send("Error fetching signup data");
     }
 
     // Get the result from the first query
     const signupName = signupResult[0].Name;
     const signupPhone = signupResult[0].Mobile_No;
     const Timing = signupResult[0].timestamp;
     const signupAddress = signupResult[0].Address;
 
     // Execute the query to get the cost of the product
     var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
     con.query(productCostSql, [productId], function(error, costResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error fetching product cost");
         }
     const productCost = costResult[0].cost;
         
     // Execute the second query
     var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,?,?)";
     con.query(orderSql, [signupName,signupPhone,signupAddress,productId,Cname,Timing,productCost], function(error, orderResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error inserting order data");
         }
 
         // Redirect the user back to the Chinese page
         res.redirect('/burger');
     });
 });
 });
});

//for sandwich add
app.get('/s_add', (req, res) => {
  
  const productId = req.query.id_s;
  const Cname=req.query.s_name;
   
  if (req.session.sandwich_count[productId]) {
   req.session.sandwich_count[productId]++;
 } else {
   req.session.sandwich_count[productId] = 1;
 }
   //Execute the first query
   var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
   con.query(signupSql,[x,y], function(error, signupResult) {
     if (error) {
         console.log(error);
         return res.status(500).send("Error fetching signup data");
     }
 
     // Get the result from the first query
     const signupName = signupResult[0].Name;
     const signupPhone = signupResult[0].Mobile_No;
     const Timing = signupResult[0].timestamp;
     const signupAddress = signupResult[0].Address;
 
     // Execute the query to get the cost of the product
     var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
     con.query(productCostSql, [productId], function(error, costResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error fetching product cost");
         }
     const productCost = costResult[0].cost;
         
     // Execute the second query
     var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,?,?)";
     con.query(orderSql, [signupName,signupPhone,signupAddress,productId,Cname,Timing,productCost], function(error, orderResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error inserting order data");
         }
 
         // Redirect the user back to the Chinese page
         res.redirect('/sandwich');
     });
 });
 });
 });

 //for nonveg add
app.get('/n_add', (req, res) => {
  
  const productId = req.query.id_n;
  const Cname=req.query.n_name;
   
  if (req.session.n_count[productId]) {
   req.session.n_count[productId]++;
 } else {
   req.session.n_count[productId] = 1;
 }
   //Execute the first query
   var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
   con.query(signupSql,[x,y], function(error, signupResult) {
     if (error) {
         console.log(error);
         return res.status(500).send("Error fetching signup data");
     }
 
     // Get the result from the first query
     const signupName = signupResult[0].Name;
     const signupPhone = signupResult[0].Mobile_No;
     const Timing = signupResult[0].timestamp;
     const signupAddress = signupResult[0].Address;
 
     // Execute the query to get the cost of the product
     var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
     con.query(productCostSql, [productId], function(error, costResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error fetching product cost");
         }
     const productCost = costResult[0].cost;
         
     // Execute the second query
     var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,?,?)";
     con.query(orderSql, [signupName,signupPhone,signupAddress,productId,Cname,Timing,productCost], function(error, orderResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error inserting order data");
         }
 
         // Redirect the user back to the Chinese page
         res.redirect('/nonveg');
     });
 });
 });
 });

  //for cold add
app.get('/c_add', (req, res) => {
  
  const productId = req.query.id_c;
  const Cname=req.query.c_name;
   
  if (req.session.c_count[productId]) {
   req.session.c_count[productId]++;
 } else {
   req.session.c_count[productId] = 1;
 }
   //Execute the first query
   var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
   con.query(signupSql,[x,y], function(error, signupResult) {
     if (error) {
         console.log(error);
         return res.status(500).send("Error fetching signup data");
     }
 
     // Get the result from the first query
     const signupName = signupResult[0].Name;
     const signupPhone = signupResult[0].Mobile_No;
     const Timing = signupResult[0].timestamp;
     const signupAddress = signupResult[0].Address;
 
     // Execute the query to get the cost of the product
     var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
     con.query(productCostSql, [productId], function(error, costResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error fetching product cost");
         }
     const productCost = costResult[0].cost;
         
     // Execute the second query
     var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP(),?)";
     con.query(orderSql, [signupName,signupPhone,signupAddress,productId,Cname,productCost], function(error, orderResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error inserting order data");
         }
 
         // Redirect the user back to the Chinese page
         res.redirect('/cold');
     });
 });
 });
 });

    //for icecream add
app.get('/i_add', (req, res) => {
  
  const productId = req.query.id_i;
  const Cname=req.query.i_name;
   
  if (req.session.i_count[productId]) {
   req.session.i_count[productId]++;
 } else {
   req.session.i_count[productId] = 1;
 }
   //Execute the first query
   var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
   con.query(signupSql,[x,y], function(error, signupResult) {
     if (error) {
         console.log(error);
         return res.status(500).send("Error fetching signup data");
     }
 
     // Get the result from the first query
     const signupName = signupResult[0].Name;
     const signupPhone = signupResult[0].Mobile_No;
     const Timing = signupResult[0].timestamp;
     const signupAddress = signupResult[0].Address;
 
     // Execute the query to get the cost of the product
     var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
     con.query(productCostSql, [productId], function(error, costResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error fetching product cost");
         }
     const productCost = costResult[0].cost;
         
     // Execute the second query
     var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,?,?)";
     con.query(orderSql, [signupName,signupPhone,signupAddress,productId,Cname,Timing,productCost], function(error, orderResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error inserting order data");
         }
 
         // Redirect the user back to the Chinese page
         res.redirect('/icecream');
     });
 });
 });
 });

 
    //for south add
app.get('/south_add', (req, res) => {
  
  const productId = req.query.id_south;
  const Cname=req.query.south_name;
   
  if (req.session.south_count[productId]) {
   req.session.south_count[productId]++;
 } else {
   req.session.south_count[productId] = 1;
 }
   //Execute the first query
   var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
   con.query(signupSql,[x,y], function(error, signupResult) {
     if (error) {
         console.log(error);
         return res.status(500).send("Error fetching signup data");
     }
 
     // Get the result from the first query
     const signupName = signupResult[0].Name;
     const signupPhone = signupResult[0].Mobile_No;
     const Timing = signupResult[0].timestamp;
     const signupAddress = signupResult[0].Address;
 
     // Execute the query to get the cost of the product
     var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
     con.query(productCostSql, [productId], function(error, costResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error fetching product cost");
         }
     const productCost = costResult[0].cost;
         
     // Execute the second query
     var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,?,?)";
     con.query(orderSql, [signupName,signupPhone,signupAddress,productId,Cname,Timing,productCost], function(error, orderResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error inserting order data");
         }
 
         // Redirect the user back to the Chinese page
         res.redirect('/south');
     });
 });
 });
 });
 
   //for maha add
app.get('/m_add', (req, res) => {
  
  const productId = req.query.id_m;
  const Cname=req.query.m_name;
   
  if (req.session.m_count[productId]) {
   req.session.m_count[productId]++;
 } else {
   req.session.m_count[productId] = 1;
 }
   //Execute the first query
   var signupSql = "SELECT Name,Mobile_No,Address,timestamp FROM Signup where Email=? AND Password=?";
   con.query(signupSql,[x,y], function(error, signupResult) {
     if (error) {
         console.log(error);
         return res.status(500).send("Error fetching signup data");
     }
 
     // Get the result from the first query
     const signupName = signupResult[0].Name;
     const signupPhone = signupResult[0].Mobile_No;
     const Timing = signupResult[0].timestamp;
     const signupAddress = signupResult[0].Address;
 
     // Execute the query to get the cost of the product
     var productCostSql = "SELECT cost FROM Products WHERE product_id = ?";
     con.query(productCostSql, [productId], function(error, costResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error fetching product cost");
         }
     const productCost = costResult[0].cost;
         
     // Execute the second query
     var orderSql = "INSERT INTO orders (customer_Name,Phone,Address,product_id,product_name,date_and_time,cost) VALUES (?,?,?,?,?,?,?)";
     con.query(orderSql, [signupName,signupPhone,signupAddress,productId,Cname,Timing,productCost], function(error, orderResult) {
         if (error) {
             console.log(error);
             return res.status(500).send("Error inserting order data");
         }
 
         // Redirect the user back to the Chinese page
         res.redirect('/maha');
     });
 });
 });
 });
 

//For getting cart table
app.get('/Cart',function(req,res) {
  //For going to Signup page after clicking signup button
  let products;
  let vname=a;
let vphone=b;
let vmail=x;
let vaddress=c;
const productId = req.session.productId;
// const productId = req.query.product_id;
console.log(productId);

var sql="SELECT customer_Name, Phone, product_id, product_name,cost,COUNT(*) as count FROM orders WHERE customer_Name=? AND Phone=? GROUP BY customer_Name, Phone, product_id, product_name,cost ";
      var productSql = "SELECT * FROM orders where customer_name=? AND Phone=?";
      con.query(sql,[vname,vphone], function(error, productResult) {
        if (error) {
          console.log(error);
          return res.status(500).send("Error fetching products");
        }
        products = productResult;
      

res.render(__dirname+"/cart",{products:products,name:vname,phone:vphone,mail:vmail,add:vaddress});

});
});
// });

//For showing table for manage category
app.get('/manage', (req, res) => {   
  con.connect(function(error){
if(error) console.log(error);

var sql="SELECT * FROM Category";
con.query(sql,function(error,result) {
  if(error) console.log(error);
  console.log(result);
  res.render(__dirname+"/manage",{category:result})
})
}) ;
});

//table in view users
app.get('/verify', (req, res) => {   
  con.connect(function(error){
if(error) console.log(error);

var sql="SELECT * FROM Signup";
con.query(sql,function(error,result) {
  if(error) console.log(error);
  console.log(result);
  res.render(__dirname+"/verify",{category:result})
})
}) ;
});

//table in view orders
app.get('/orders', (req, res) => {   
  con.connect(function(error){
if(error) console.log(error);

var sql="SELECT * FROM orders";
con.query(sql,function(error,result) {
  if(error) console.log(error);
  console.log(result);
  res.render(__dirname+"/orders",{category:result})
})
}) ;
});

//Global variables
var x;
var y;
var a;
var b;
var c;
var admin_add;
var admin_mob;
var admin_name;




//For signup submit
// app.post('/',function(req,res) {
//   console.log(req.body);
//  const button=req.body.button;
//  console.log(button);
//   if(button==="submitb"){
//   var name=req.body.name;
//   var email=req.body.email;
//   var mob=req.body.mob_no;
//   var address=req.body.Address;
//   var password=req.body.Password;

//   a=name;
//   b=mob;
//   c=address;
 
//   con.connect(function (error) {
//    if (error) 
//    res.send("Connection Error!")
   
//    var sql = "INSERT INTO Signup (Name, Email, Mobile_No, Address, Password) VALUES (?, ?, ?, ?, ?)";
//    var values = [name, email, mob, address, password];
   
//    con.query(sql, values, function (error, result) {
//        if (error) {
//          return res.send("Database error");
//          }
 
//        res.sendFile(__dirname+'/login.html'); 
//    });
//  })
//  }
//   else{
//     console.log("Hi admin");
//     var name=req.body.name;
//     var email=req.body.email;
//     var mob=req.body.mob_no;
//     var address=req.body.Address;
//     var password=req.body.Password;
  
//     admin_name=name;
//     admin_mob=mob;
//     admin_add=address;
   
//     con.connect(function (error) {
//      if (error)
//      res.send("Connection Error!")
     
//      var sql = "INSERT INTO Admin_Signup (A_Name, A_Email, A_Mobile_No, A_Address, A_Password,A_timestamp) VALUES (?, ?, ?, ?, ?)";
//      var values = [name, email, mob, address, password];
     
//      con.query(sql, values, function (error, result) {
//          if (error) {
//            return result.send("Database error");
//            }
   
//          result.sendFile(__dirname+'/login.html'); 
//      });
//    })
// }
// });
app.post('/', function(req, res) {
  console.log(req.body);
  var button = req.body.button;
  console.log(button);
  if (button === "submitb") {
      var name = req.body.name;
      var email = req.body.email;
      var mob = req.body.mob_no;
      var address = req.body.Address;
      var password = req.body.Password;

      a = name;
      b = mob;
      c = address;

      con.connect(function(error) {
          if (error) {
              console.log(error); // Log the error
              return res.send("Connection Error!");
          }

          var sql = "INSERT INTO Signup (Name, Email, Mobile_No, Address, Password) VALUES (?, ?, ?, ?, ?)";
          var values = [name, email, mob, address, password];

          con.query(sql, values, function(error, result) {
              if (error) {
                  console.log(error); // Log the error
                  return res.send("Database error");
              }

              res.sendFile(__dirname + '/login.html');
          });
      });
  } else {
      console.log("Hi admin");
      var name = req.body.name;
      var email = req.body.email;
      var mob = req.body.mob_no;
      var address = req.body.Address;
      var password = req.body.Password;

      admin_name = name;
      admin_mob = mob;
      admin_add = address;

      con.connect(function(error) {
          if (error) {
              console.log(error); // Log the error
              return res.send("Connection Error!");
          }

          var sql = "INSERT INTO Admin_Signup (A_Name, A_Email, A_Mobile_No, A_Address, A_Password) VALUES (?, ?, ?, ?, ?)";
          var values = [name, email, mob, address, password];

          con.query(sql, values, function(error, result) {
              if (error) {
                  console.log(error); // Log the error
                  return res.send("Database error");
              }

              res.sendFile(__dirname + '/login.html');
          });
      });
  }
});

//For yes submit
app.post('/yesf', function(req, res) {
    

  var name = req.body.nameh;
  var id = req.body.idh;



      var sql = "UPDATE Signup SET Feedback=? ,Rating=? WHERE Name=? and Email=?";
      var values = [name,id,a,x];
console.log(values);
      con.query(sql, values, function(error, result) {
          if (error) {
              console.log(error); // Log the error
              return res.send("Database error");
          }

          res.sendFile(__dirname + '/Homepage.html');
      });
  });


app.post('/logins',function(req,res) {
  console.log(req.body);
  var button = req.body.button;
  console.log(button);
  // const button = req.body.buttons;
  // console.log(button);
  
  if(button==="l_u"){
    console.log("Hi login");
  const email_login=req.body.email;
  const password_login=req.body.Password;
  req.session.pizza_count = {};
  req.session.Chinese_count = {};
  req.session.burger_count = {};
  req.session.sandwich_count = {};
  req.session.n_count = {};
  req.session.i_count = {};
  req.session.c_count = {};
  req.session.m_count = {};
  req.session.south_count = {};
  x=email_login;
  y=password_login;

  console.log(x);
  console.log(y);

var sql1 = "SELECT Name,Mobile_No,Address FROM Signup WHERE email = ? AND password = ?";
con.query(sql1, [email_login, password_login], function (error, result) {
  if (error) {
    console.log(error);
    return res.status(500).send("Error fetching signup data");
  }

  console.log(result);
  var myname = result[0].Name;
  var myphone = result[0].Mobile_No;
  var myaddress=result[0].Address;
  a=myname;
  b=myphone;
  c=myaddress;

});

var sql = "SELECT * FROM Signup WHERE email = ? AND password = ?";
con.query(sql, [email_login, password_login], function (error, result) {

       if (error) {
        console.log(error);
         result.send("Database error");
         }
 if(result.length>0){
 res.sendFile(__dirname+'/Homepage.html');
 }
 else{
   res.send('Invalid email or password');
}
  });


}
else if(button==="l_a"){
  const email_login=req.body.email;
  const password_login=req.body.Password;
  var sql = "SELECT * FROM Signup WHERE email = ? AND password = ?";
con.query(sql, [email_login, password_login], function (error, result) {

       if (error) {
        console.log(error);
         result.send("Database error");
         }
 if(result.length>0){
//  res.sendFile(__dirname+'/admin_hp.html');
 res.sendFile(__dirname+'/admin_hp.html');
 }
 else{
   res.send('Invalid email or password');
}
  });
}
});

//For order history
app.get('/history', (req, res) => {
  con.connect(function(error){
    if(error) console.log(error);
    
    var sql="SELECT * FROM orderHistory";
    con.query(sql,function(error,result) {
      if(error) console.log(error);
      console.log(result);
      res.render(__dirname+"/history",{category:result})
    })
    }) ;
});



//For tables in new product page
app.get('/newproduct', (req, res) => {
  let categories, products;

    // Fetch categories
    var categorySql = "SELECT * FROM Category";
    con.query(categorySql, function(error, categoryResult) {
      if (error) {
        console.log(error);
        return res.status(500).send("Error fetching categories");
      }
      categories = categoryResult;

      // Fetch products
      var productSql = "SELECT * FROM Products";
      con.query(productSql, function(error, productResult) {
        if (error) {
          console.log(error);
          return res.status(500).send("Error fetching products");
        }
        products = productResult;

        // Render the page after both queries are executed
        res.render(__dirname + "/NProduct", { category: categories, products: products });
      });
    });
 
});


//For table in chinese



app.get('/chinese', (req, res) => {

  var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'Chinese' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.Chinese_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log("Chinese Count:", req.session.Chinese_count);
          res.render(__dirname + "/chinese", {
            products: productResult,
            Chinese_count: req.session.Chinese_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
});


//For table in pizza

    app.get('/pizza', (req, res) => {
    
      var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'Pizza' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.pizza_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log("Pizza Count:", req.session.pizza_count);
          res.render(__dirname + "/pizza", {
            products: productResult,
            pizza_count: req.session.pizza_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
    });

    //For table in burger
    
app.get('/burger', (req, res) => {
  var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'Burger' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.burger_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log("Burger Count:", req.session.burger_count);
          res.render(__dirname + "/burger", {
            products: productResult,
            burger_count: req.session.burger_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
    });

        //For table in sandwich
    
app.get('/sandwich', (req, res) => {
  var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'Sandwich' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.sandwich_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log("Sandwich Count:", req.session.sandwich_count);
          res.render(__dirname + "/sandwich", {
            products: productResult,
            sandwich_count: req.session.sandwich_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
    });

        //For table in nonveg
    
        app.get('/nonveg', (req, res) => {
          var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'Nonveg' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.sandwich_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log(" Count:", req.session.n_count);
          res.render(__dirname + "/nonveg", {
            products: productResult,
            n_count: req.session.n_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
            });

                    //For table in cold
    
app.get('/cold', (req, res) => {
  var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'Cold' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.sandwich_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log(" Count:", req.session.c_count);
          res.render(__dirname + "/cold", {
            products: productResult,
            c_count: req.session.c_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
    });

            //For table in icecream
    
app.get('/icecream', (req, res) => {
  console.log("Hi ice");
  var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'Desserts' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.sandwich_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log(" Icecream Count:", req.session.i_count);
          res.render(__dirname + "/icecream", {
            products: productResult,
            i_count: req.session.i_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
    });

            //For table in south
    
app.get('/south', (req, res) => {
  var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'South Indian' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.south_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log(" Count:", req.session.south_count);
          res.render(__dirname + "/south", {
            products: productResult,
            south_count: req.session.south_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
    });

            //For table in maha
    
app.get('/maha', (req, res) => {
  var productSql = `
  SELECT p.*, IFNULL(COUNT(o.product_id), 0) AS count,p.cost AS cost
  FROM Products p 
  LEFT JOIN orders o ON p.product_id = o.product_id AND o.customer_Name = ? AND o.Phone = ? 
  WHERE p.C_name = 'Maharashtrian' 
  GROUP BY p.product_id`;

  con.query(productSql, [a, b], function(error, productResult) {
    if (error) {
      return res.status(500).send("Error fetching products");
    }
    console.log(productResult);

    // Iterating over each product to get the count
    productResult.forEach(function(product, index) {
      var countQuery = "SELECT COUNT(*) AS count FROM orders WHERE customer_Name=? AND Phone=? AND product_id=?";
      con.query(countQuery, [a, b, product.product_id], function(error, countResult) {
        if (error) {
          console.error("Error fetching count for product_id:", product.product_id);

          
        } else {
          req.session.m_count[product.product_id] = countResult[0].count; // Storing the count in the session
          Mycount=countResult[0].count;
        }
        // Rendering the page once all counts are obtained
        if (index === productResult.length - 1) {
          console.log(" Count:", req.session.m_count);
          res.render(__dirname + "/maha", {
            products: productResult,
            m_count: req.session.m_count,
            Mycount:Mycount
          });
        }
      });
    });
  });
    });

//For deleting in manage category
app.get('/delete',function(req,res){
  con.connect(function(error){
    if(error) console.log(error);
    
    var sql="DELETE FROM Category WHERE id=?";
    var ID=req.query.id;
    con.query(sql,[ID],function(error,result) {
      if(error) console.log(error);
      console.log(result);
      res.redirect('/manage');
    });
    }) ;
});

//For deleting a new product
app.get('/deletep',function(req,res){
  con.connect(function(error){
    if(error) console.log(error);
    
    var sql="DELETE FROM Products WHERE product_id=?";
    var ID=req.query.product_id;
    console.log(ID);
    con.query(sql,[ID],function(error,result) {
      if(error) console.log(error);
      console.log(result);
      res.redirect('/newproduct');
    });
    }) ;
});

//For deleting a pizza
app.get('/pizza_delete',function(req,res){
 
    var pizzaname=a;
var pizzaphone=b;
console.log(pizzaname);
console.log(pizzaphone);
    var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1  ";
    var ID=req.query.id_pizza;
    if (req.session.pizza_count[ID]) {
      req.session.pizza_count[ID]--;
    }
    con.query(sql,[ID,pizzaname,pizzaphone],function(error,result) {
      if(error) console.log(error);
      console.log(ID);
      res.redirect('/pizza');
    });
    
});
//chinese delete
app.get('/chinese_delete',function(req,res){
  var ID=req.query.id_chinese;
    if (req.session.Chinese_count[ID]) {
      req.session.Chinese_count[ID]--;
    }
 
console.log(a);
console.log(b);
  var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1 ";
  var ID=req.query.id_chinese;
  console.log(ID);
  con.query(sql,[ID,a,b],function(error,result) {
    if(error) console.log(error);
    console.log(ID);
    res.redirect('/chinese');
  });
  
});
//burger delete
app.get('/burger_delete',function(req,res){
  if (req.session.burger_count[ID]) {
    req.session.burger_count[ID]--;
  }
    var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1 ";
    var ID=req.query.id_burger;
    console.log(ID);
    con.query(sql,[ID,a,b],function(error,result) {
      if(error) console.log(error);
      //console.log(ID);
      res.redirect('/burger');
    });
    
  });
//sandwich delete
app.get('/s_delete',function(req,res){
 
  if (req.session.sandwich_count[ID]) {
    req.session.sandwich_count[ID]--;
  }
    var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1 ";
    var ID=req.query.id_s;
    console.log(ID);
    con.query(sql,[ID,a,b],function(error,result) {
      if(error) console.log(error);
      //console.log(ID);
      res.redirect('/sandwich');
    });
  
});
//nonveg delete
app.get('/n_delete',function(req,res){
 
  var ID=req.query.id_n;
    if (req.session.n_count[ID]) {
      req.session.n_count[ID]--;
    }
 
console.log(a);
console.log(b);
  var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1 ";
  var ID=req.query.id_n;
  console.log(ID);
  con.query(sql,[ID,a,b],function(error,result) {
    if(error) console.log(error);
    console.log(ID);
    res.redirect('/nonveg');
  });
  
});
//cold delete
app.get('/c_delete',function(req,res){
 
  var ID=req.query.id_c;
    if (req.session.c_count[ID]) {
      req.session.c_count[ID]--;
    }
 
console.log(a);
console.log(b);
  var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1 ";
  var ID=req.query.id_c;
  console.log(ID);
  con.query(sql,[ID,a,b],function(error,result) {
    if(error) console.log(error);
    console.log(ID);
    res.redirect('/cold');
  });
  
});
//icecream delete
app.get('/i_delete',function(req,res){
 
  var ID=req.query.id_i;
    if (req.session.i_count[ID]) {
      req.session.i_count[ID]--;
    }
 
console.log(a);
console.log(b);
  var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1 ";
  var ID=req.query.id_i;
  console.log(ID);
  con.query(sql,[ID,a,b],function(error,result) {
    if(error) console.log(error);
    console.log(ID);
    res.redirect('/icecream');
  });
  
});
//south delete
app.get('/south_delete',function(req,res){
 
  var ID=req.query.id_south;
    if (req.session.south_count[ID]) {
      req.session.south_count[ID]--;
    }
 
console.log(a);
console.log(b);
  var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1 ";
  var ID=req.query.id_south;
  console.log(ID);
  con.query(sql,[ID,a,b],function(error,result) {
    if(error) console.log(error);
    console.log(ID);
    res.redirect('/south');
  });
  
});
//maha delete
app.get('/maha_delete',function(req,res){
 
  var ID=req.query.id_m;
    if (req.session.m_count[ID]) {
      req.session.m_count[ID]--;
    }
 
console.log(a);
console.log(b);
  var sql="DELETE FROM orders WHERE product_id=? AND customer_Name=? AND Phone=? limit 1 ";
  var ID=req.query.id_m;
  console.log(ID);
  con.query(sql,[ID,a,b],function(error,result) {
    if(error) console.log(error);
    console.log(ID);
    res.redirect('/maha');
  });
  
});
//For signup submit
app.post('/',function(req,res) {
 console.log(req.body);

 var name=req.body.name;
 var email=req.body.email;
 var mob=req.body.mob_no;
 var address=req.body.Address;
 var password=req.body.Password;

 con.connect(function (error) {
  if (error) 
  res.send("Connection Error!")
  
  var sql = "INSERT INTO Signup (Name, Email, Mobile_No, Address, Password) VALUES (?, ?, ?, ?, ?)";
  var values = [name, email, mob, address, password];
  
  con.query(sql, values, function (error, result) {
      if (error) {
        return result.send("Database error");
        }

      res.sendFile(__dirname+'/login.html'); 
  });
})
});


  
app.get('/payment', function(req, res) {
  var sql2 = "SELECT * FROM orders WHERE customer_Name=? AND Phone=?";
  con.query(sql2, [a, b], function(error, result) {
      if (error) {
          console.log(error);
      } else {
          // Loop through the result and insert each row into the ordersHistory table
          result.forEach(function(row) {
              var sql1 = "INSERT INTO orderHistory(C_name, Phone, Address, product_id, product_name, date_and_time,cost) VALUES (?, ?, ?, ?, ?, ?,?)";
              con.query(sql1, [row.customer_Name, row.Phone, row.Address, row.product_id, row.product_name, row.date_and_time,row.cost], function(error, result) {
                  if (error) {
                      console.log(error);
                  }
              });
          });

          // After inserting all rows into the ordersHistory table, delete them from the orders table
          var sql = "DELETE FROM orders WHERE customer_Name=? AND Phone=?";
          con.query(sql, [a, b], function(error, result) {
              if (error) {
                  console.log(error);
              } else {
                  res.sendFile(__dirname + '/yes.html');
              }
          });
      }
  });
});

 //For forgot password
 app.post('/fp',function(request,result1) {
  console.log(request.body);
 
  var email=request.body.email;
  var password=request.body.Password;
 
  
  var sql = "SELECT * FROM Signup WHERE email = ?";
 con.query(sql, [email], function (error, result2) {

       if (error) {
        console.log(error);
        throw error;
         }

 if(result2.length>0){
  var sql2="UPDATE Signup SET Password=? WHERE email=?";
  con.query(sql2,[password,email],function (err,result3) {
    if(err){
      console.log(err);
      throw err;
    }
    console.log("done");
    result1.sendFile(__dirname+'/Homepage.html');
  
  });
 
 }
 else{
   result1.send('Invalid email');
}
  });

 });

 
 app.get('/api/unique-dates', (req, res) => {
  // Query to select distinct dates only
  const query = "SELECT DISTINCT DATE(date_and_time) AS unique_date FROM orderHistory ORDER BY DATE(date_and_time) ASC";

  con.query(query, (error, results) => {
      if (error) {
          console.error('Failed to fetch unique dates:', error);
          return res.status(500).send("Error fetching unique dates");
      }
      // Send back the results which will be an array of dates
      res.json(results.map(result => result.unique_date));
  });
});


 app.post('/fetch-d', (req, res) => {
  const { fromDate, toDate } = req.body;

  let query = "SELECT * FROM orderHistory WHERE 1 = 1";
  const params = [];

  if (fromDate) {
      query += " AND date_and_time >= ?";
      params.push(fromDate);
  }
  
  if (toDate) {
      query += " AND date_and_time <= ?";
      params.push(toDate);
  }

  query += " ORDER BY date_and_time ASC;";

  con.query(query, params, (error, results) => {
      if (error) throw error;
      res.json(results);
  });
});

 app.post('/fetch-data', (req, res) => {
  const selectedCategory = req.body.category;

  // Construct and execute SQL query based on selected category
  let sqlQuery;
  if (selectedCategory === '') {
      sqlQuery = 'SELECT * FROM Products';
  } else {
      sqlQuery = `SELECT * FROM Products WHERE C_Name = '${selectedCategory}'`;
  }

  // Execute SQL query
  con.query(sqlQuery, (error, results, fields) => {
      if (error) throw error;
      console.log(results);
      res.json(results);
  });
});

 

//For save in Manage Category
app.post('/manage', function(req, res) {
  console.log(req.body);
  
  var name = req.body.name;
  var id=req.body.id;

 var sql = "INSERT INTO Category (id,Category_Name) VALUES (?,?)";
      var values = [id,name];

      con.query(sql, values, function(error, result) {
          if (error) {
              console.error('Error executing query: ' + error.stack);
              return res.status(500).send("Database error");
          }

          console.log("1 record inserted");
          
          res.redirect('/manage');
      });
});

//For add in new product
app.post('/newproduct', function(req, res) {
  console.log(req.body);
  
  var name = req.body.name;
  var id=req.body.id;
  var cost=req.body.cost;

 var sql = "INSERT INTO Products (product_name,category_id,cost,C_Name) SELECT (?),(?),(?),(select Category_Name from Category where id=?)";
      var values = [name,id,cost,id];

      con.query(sql, values, function(error, result) {
        
          if (error) {
              console.error('Error executing query: ' + error.stack);
              return res.status(500).send("Database error");
          }

          console.log("1 record inserted");
          
          res.redirect('/newproduct');
      });
});

//For cahnge cost
app.post('/changecost', function(req, res) {
  var productId = req.body.id;
  var newCost = req.body.cost;

  var sql = "UPDATE Products SET cost = ? WHERE product_id = ?";
  var values = [newCost, productId];

  con.query(sql, values, function(error, result) {
      if (error) {
          console.error('Error executing query: ' + error.stack);
          return res.status(500).send("Database error");
      }

      console.log("Cost updated successfully");
      
      res.redirect('/newproduct'); // Redirect to admin page or any other page you want
  });
});




 


app.listen(5500); 









