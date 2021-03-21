const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ingredients: String,
    instructions: String,
    weight: Number,
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    isFavorite:{type: Boolean, default: false},
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
productSchema.plugin(require("../plugins/isDeletedFalse"));

productSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.isDeleted;
  return obj;
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
