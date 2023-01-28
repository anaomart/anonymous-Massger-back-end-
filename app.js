const express = require('express')
const app = express();
const cors = require('cors');
const DB_connection = require('./util/DB_Connection');
require('dotenv').config();
const PORT = 4000;
const user = require('./api/user.api');
const message = require('./api/messages.api');
const { globalMiddleWare } = require('./util/globalMiddleware');
// middleware 
app.use(cors());
app.use(express.json());

//
app.use('/user', user)
app.use('/message', message)


// app.use('/', (req, res) => res.json({ message: "Welcome to Express" }))
DB_connection();
// // api


app.use((error, req, res, next) => {
    let x = error;
    console.log(x);
    res.json({ error: x })
})


app.listen(PORT, console.log("Listening on port: " + PORT))