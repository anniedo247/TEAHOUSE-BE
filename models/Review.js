const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = Schema(
  {
    product: { type:Schema.Types.ObjectId , ref:"Product" },
    rating:{type: Number, min:1, max:5, required: true},
    user:{ type: Schema.Types.ObjectId, ref:"User"},
    title: String,
    body: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
reviewSchema.plugin(require("../plugins/isDeletedFalse"));

reviewSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.isDeleted;
  return obj;
};

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;