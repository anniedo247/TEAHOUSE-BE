const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = Schema(
  {
    name: { type: String, required: true, trim: true ,lowercase: true},
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
categorySchema.plugin(require("../plugins/isDeletedFalse"));

categorySchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.isDeleted;
  return obj;
};

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
