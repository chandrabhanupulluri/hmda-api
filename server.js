 var express = require('express');
 var app = express();
 var bodyParser = require('body-parser');
 var mysql = require('mysql');
 var cors = require('cors');

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
     extended: true
 }));

 app.use(cors());

 // connection configurations
 var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'udcas',
    port: 8889
});
// connect to database
dbConn.connect(); 

 // default route
 app.get('/', function (req, res) {
     return res.send({ error: true, message: 'hello' })
 });

 // Retrieve all users 
 app.get('/users', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});

// Retrieve user with id 
app.get('/user/', function (req, res) {
    let user_id = req.body.email;
    let user_psd = req.body.password;
    if (!user_id) {
     return res.status(400).send({ error: true, message: 'Please provide user_id' });
    } 
   
    dbConn.query("SELECT * FROM users where email = ? AND password = ? ", [user_id, user_psd], function (error, results, fields) {
     if (error) throw error;
     if(!results[0]){
         return res.send({error: true, message:'User Not Found'})
     }
      return res.send({ error: false, data: results[0], message: 'Login Success.' });
    });
});

// Retrieve user with id 
app.post('/auth/', function (req, res) {
    let user_id = req.body.email;
    let user_psd = req.body.password;
    if (!user_id) {
     return res.status(400).send({ error: true, message: 'Please provide user_id' });
    } 
   
    dbConn.query("SELECT * FROM users where email = ? AND password = ? ", [user_id, user_psd], function (error, results, fields) {
     if (error) throw error;
     if(!results[0]){
         return res.send({error: true, message:'User Not Found'})
     }
      return res.send({ error: false, data: results[0], message: 'Login Success.' });
    });
});

// Add a new user  
app.post('/user', function (req, res) {
    let user_data = req.body;
    // console.log("userdata", user_data, user_data.full_name);
    if (!user_data) {
      return res.status(400).send({ error:true, message: 'Please provide user' });
    }
   dbConn.query("INSERT INTO users SET ? ", { full_name: user_data.full_name,  email: user_data.email, phone: user_data.phone, access_type: user_data.access_type, status: user_data.status, password: user_data.password  }, function (error, results, fields) {
  if (error) throw error;
    return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});

//  Update user with id
app.put('/user', function (req, res) {
    let user_data = req.body;
    if (!user_data) {
      return res.status(400).send({ error: user, message: 'Please provide updated user details' });
    }
    dbConn.query("UPDATE users SET status = ? WHERE email = ?", [user_data.status, user_data.email], function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
     });
    });

    //  Delete user
 app.delete('/user', function (req, res) {
    let user_data = req.body;
    if (!user_data) {
        return res.status(400).send({ error: true, message: 'Please provide user details' });
    }
    dbConn.query('DELETE FROM users WHERE email = ?', [user_data.email], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been deleted successfully.' });
    });
    }); 

 // set port
 app.listen(3001, function () {
     console.log('Node app is running on port 3001');
 });
 module.exports = app;