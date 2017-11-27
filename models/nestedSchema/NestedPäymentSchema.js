const mongoose = require('mongoose');

let Payment = mongoose.Schema({
    id_transaction: String,
    value: number,
    validite: Boolean,
    name: { type: String, required: true },
})

module.exports = Payment;