const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        size: { type: String, enum: ["small", "medium", "large"] },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        images: [{ type: String, required: true }],
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      ward: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: Date,
    deliveryCharge: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
orderSchema.plugin(require("../plugins/isDeletedFalse"));

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.isDeleted;
  return obj;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
