const { sendMessage, getAllMessage } = require('../services/messages');
const auth = require('../middleware/auth');
const app = require('express').Router();


app.post('/send/:id', sendMessage);

app.get('/allMessages', auth, getAllMessage)


module.exports = app