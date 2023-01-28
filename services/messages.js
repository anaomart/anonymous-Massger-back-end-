const { isValidObjectId } = require('mongoose');
const messagesModel = require('../model/massages.model')
const { catchAsyncError } = require('../util/catchAsyncError');


module.exports.sendMessage = catchAsyncError(async(req, res) => {
    console.log('sendMessage')
    const { body } = req.body;
    const { id } = req.params
    const { _id } = req // not required
    console.log(body)
    if (!body) {
        return res.json({ message: "message is required" })
    }
    if (!isValidObjectId(id)) {
        return res.json({ message: "Invalid Id" })
    }

    let message = await messagesModel.create({ body, receiver: id, sent: _id || "anonymous" }).catch(error => res.json({ message: error.message }));

    res.status(200).json({ message: "success", message: message })
})


module.exports.getAllMessage = catchAsyncError(async(req, res) => {
    const { _id } = req._id;

    let messages = await messagesModel.find({ receiver: _id })

    res.status(200).json({ message: 'success', messages })



})