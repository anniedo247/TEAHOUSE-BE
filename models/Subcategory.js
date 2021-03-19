const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subcategorySchema = Schema(
  {
    name: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
subcategorySchema.plugin(require("../plugins/isDeletedFalse"));

subcategorySchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.isDeleted;
  return obj;
};

const Subcategory = mongoose.model("Subcategory", subcategorySchema);
module.exports = Subcategory;
