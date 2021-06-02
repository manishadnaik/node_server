// Mongodb suing Mongoose code schema db definition starts here
const fileHelper = require("../util/file");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  max_amount: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdDate: {
    type: Schema.Types.Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
