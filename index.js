import express from "express"
import mysql from "mysql"

const app = express()
app.use(express.json())
const PORT = 8104

app.get("/", (req,res)=>{
    res.send({message: "hello world"})
})

//db
const DBconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database:"curd",
    password: ""
  });
  
  DBconnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


  //routers:
  // Route for fetching all records
app.get('/api/users', (req, res) => {
    DBconnection.query('SELECT * FROM userdata', (error, results) => {
      if (error) {
        console.log("error",error)
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
    });
  });
  // insert user
  app.post('/api/user/add',(req,res)=>{
    const {firstname,lastname,email,mobile}= req.body;
   DBconnection.query('INSERT INTO userdata (firstname,lastname,email,mobile)VALUES (?, ?, ?, ?)', [firstname,lastname,email,mobile], (error, results) => {
    if (error) {
        console.log("error",error)
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'User created successfully', id: results.insertId });
  });
  })

// Route for updating a record
app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const { firstname, lastname, email, mobile } = req.body;
    DBconnection.query('UPDATE userdata SET firstname = ?, lastname = ?, email = ?, mobile = ? WHERE id = ?', [firstname, lastname, email, mobile, id], (error, results) => {
        if (error) {
            console.log("error",error)
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    });
});

// Route for deleting a record
app.delete('/api/user/delete/:id', (req, res) => {
    const id = req.params.id;
    DBconnection.query('DELETE FROM userdata WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.log("error",error)
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    });
  });
  

app.listen(PORT,()=>{
    console.log(`server start ${PORT}`)
})