const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  lineTotal: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  totalQty: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  discount: {
    code: { type: String },
    percent: { type: Number },
    amount: { type: Number }
  },
  status: { type: String, default: 'Placed' },
  customer: { type: Object, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
