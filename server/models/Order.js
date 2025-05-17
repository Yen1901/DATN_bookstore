const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  // userId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
  },
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    city: String,
    district: String,
    ward: String,
    address: String,
    phone: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
});

module.exports = mongoose.model("Order", OrderSchema);