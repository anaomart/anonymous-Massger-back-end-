const mongoose = require('mongoose');


function DB_connection() {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_CONNECTION, () => {
        console.log('Connection established')
    })
}

module.exports = DB_connection