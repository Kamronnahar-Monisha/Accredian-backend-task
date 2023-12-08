const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;


//middle wires added
app.use(cors());
app.use(express.json());



//root api 
app.get('/', (req, res) => {
    res.send('Welcome to Accredian backend server');
})

app.listen(port, () => {
    console.log(`server side is listing at port ${port}`);
})