const mongoose = require('mongoose');

const Payment = mongoose.Schema({
  id_transaction: String,
  value: number,
  validite: Boolean,
  name: { type: String, required: true },
});

module.exports = Payment;
