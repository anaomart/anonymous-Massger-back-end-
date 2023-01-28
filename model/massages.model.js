const mongoose = require('mongoose');

const massagesSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    sent: {
        type: String
    },
    receiver: {
        type: mongoose.SchemaTypes.ObjectID,
        required: true
    }

}, { timestamps: true })
module.exports = mongoose.model('anonymous_massager_massages', massagesSchema)