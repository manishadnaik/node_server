// Mongodb suing Mongoose code schema db definition starts here
const expenseSchema = require("./expense");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
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
  remaining_amount: {
    type: String,
    required: false,
  },
  is_default: {
    type: Boolean,
    required: false,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdDate: {
    type: Schema.Types.Date,
    default: Date.now(),
  },
});

categorySchema.static("getExpenses", async function (categoryId) {
  const expenses = await expenseSchema.find({ categoryId: categoryId });
  return expenses;
});
categorySchema.static("removeExpense", async function (expense) {
  return await expenseSchema.deleteOne({ _id: expense });
});
categorySchema.static("deleteExpenses", async function (categoryId) {
  return await expenseSchema.deleteMany({ categoryId: categoryId });
});
module.exports = mongoose.model("Category", categorySchema);
