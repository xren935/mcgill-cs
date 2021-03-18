const cors = require("cors");
const express = require('express');
const mysql = require("mysql");
const path = require('path');
const app = express();



app.use(express.json());
app.use(cors())


const db = mysql.createConnection(
  {
    user:"b8b66dc7043075",
    host:"us-cdbr-east-03.cleardb.com",
    password: "ede5a8fa",
    database:"heroku_d57188f6d416032"
  }
);


db.connect(function(err){
    if(err) throw err;
    console.log("Connected!");
})


// app.post("/register", (req,res) =>{
//   const studentid = req.body.studentid;
//   const username = req.body.username;
//   const password = req.body.password;


//   db.query(
//     "INSERT INTO users (student_id,email,passcode) VALUES (?,?,?);",
//     [studentid,username,password],
//     (err, result) =>{
//       console.log(err);
//     }
//   )

// });



app.post('/login',(req,res) =>{

  
  const username = req.body.username;
  const password = req.body.password;

  
  db.query(
    "SELECT Name, UserID, Username, age, staff, changetext, CustomPage FROM users WHERE Username = ? and password = ? ;",
    [username,password],
    (err, result) =>{
      if(err){
        console.log("SQL error!");
        //console.log("username is", username);
        //console.log("password is", password);
        console.log({err: err});
      }
      else{
        if (result.length>0){
          //console.log("this is reault", JSON.stringify(result));
          res.send(JSON.stringify(result));
        }
        else{
          //console.log("user not found!");
          res.send({message:"Wrong username/password"});
        }
      }
    }
  )

} );

app.post('/changecontent',(req,res) =>{

  
  const text = req.body.changetext;
  const username = req.body.Username;
  const age = req.body.changedage;
  const name = req.body.changedname;
  //console.log("changed text:",text);
  
  db.query(
    "UPDATE users \
    SET changetext = ? , Name = ?, age = ?\
    WHERE Username = ?;",
    [text, name, age, username],
    (err, result) =>{
      if(err){
        console.log("SQL error!");
        console.log({err: err});
      }
      else{
        //console.log("change content result:",result);
        res.send({message:"change saved!"});
      }
    }
  )

} );

app.post('/CreatePage',(req,res) =>{

  
  const page = req.body.CustomPage;
  const username = req.body.Username;

  //console.log("changed page:",page);
  
  db.query(
    "UPDATE users \
    SET CustomPage = ? \
    WHERE Username = ?;",
    [page, username],
    (err, result) =>{
      if(err){
        console.log("SQL error!");
        console.log({err: err});
      }
      else{
        //console.log(result);
        res.send({message:"Customized Page saved!"});
      }
    }
  )

} );

app.post('/DeletePage',(req,res) =>{

  const username = req.body.Username;
  
  db.query(
    "UPDATE users \
    SET CustomPage = ? \
    WHERE Username = ?;",
    [null, username],
    (err, result) =>{
      if(err){
        console.log("SQL error!");
        console.log({err: err});
      }
      else{
        //console.log(result);
        res.send({message:"Page Deleted!"});
      }
    }
  )

} );


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/*const port = process.env.PORT || 5000;
app.listen(port);
console.log(port);
*/

//const port  = process.env.PORT || 3001;
// app.listen(3001,()=>{
//   console.log("running on port 3001");
// });

// heroku port 
const PORT = process.env.PORT || '8080';

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port process.env.PORT`);
});
app.set("port", PORT);

module.exports = app;