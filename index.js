const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;



//middle wires added
app.use(cors());
app.use(express.json());



//creating a connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'accredian'
});


// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// Close the connection when done
connection.end((err) => {
    if (err) {
        console.error('Error closing database connection:', err);
        return;
    }
    console.log('Disconnected from MySQL database');
});


app.post('/user', async (req, res) => {
    const user = req.body;
    console.log(user);
});




//root api 
app.get('/', (req, res) => {
    res.send('Welcome to Accredian backend server');
})

app.listen(port, () => {
    console.log(`server side is listing at port ${port}`);
})
