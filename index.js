const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
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


// Endpoint for user registration (sign-up)
app.post('/signup', async (req, res) => {
    const { userName, email, password } = req.body;

    //Checking for existing account with same email address
    connection.query(
        'SELECT * FROM users WHERE email = ?;',
        [email],
        function (err, results) {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }
            console.log(results);
            //already an account exist with the email
            if (results.length) {
                console.log('already exist an account with the email.');
                res.send({ message: "account already exist", acknowledge: false });
            }

            // Hash the password before storing it
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.log(err);
                    return;
                }

                //signing up a user
                connection.query(
                    'INSERT INTO users (email,userName,password) VALUES (?,?,?);',
                    [email, userName, hash],
                    function (err, results) {
                        if (err) {
                            console.error('Error executing query:', err);
                            return;
                        }
                        console.log(results);
                        res.send({ message: "account added successfully", acknowledge: true })
                    }
                );
            });

        }
    );
});



// Endpoint for user Log in
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //Checking for existing account with same email address
    connection.query(
        'SELECT * FROM users WHERE email = ?;',
        [email],
        function (err, results) {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }
            console.log(results);

            //Doesn't have any account with this email
            if (!results.length) {
                console.log('Does not  exist any account with this email.');
                res.send({ message: "Account does not exist", acknowledge: false });
            }
            else {
                // Checking for password correction
                console.log(results[0].password);
                bcrypt.compare(password, results[0].password, (err, response) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    if (response) {
                        res.send({ message: 'Successful login', acknowledge: true });
                    }
                    else {
                        res.send({ message: 'Wrong Password', acknowledge: false });
                    }
                });
            }


        }
    );
});




// // Close the connection when done
// connection.end((err) => {
//     if (err) {
//         console.error('Error closing database connection:', err);
//         return;
//     }
//     console.log('Disconnected from MySQL database');
// });



//root api 
app.get('/', (req, res) => {
    res.send('Welcome to Accredian backend server');
})

app.listen(port, () => {
    console.log(`server side is listing at port ${port}`);
})
