const expenseSchema = require("../models/expense");
const fileHelper = require("../util/file");

module.exports.get = async (req, res, next) => {
  const expenses = await expenseSchema.find();
  return res.status(200).json({ message: "List of expenses", expenses });
};

module.exports.create = async (req, res, next) => {
  const expenseData = {
    title: req.body.title,
    max_amount: req.body.max_amount,
    imageUrl: req.file ? req.file.path.replace(/\\/g, "/") : "",
    userId: req.body.userId,
    categoryId: req.body.categoryId,
    description: req.body.description,
  };
  const expenseObj = new expenseSchema(expenseData);
  const expense = await expenseObj.save().catch((error) => {
    return res.status(500).json(handleError(error));
  });
  return res
    .status(201)
    .json({ status: true, message: "Created a expense", expense });
};

module.exports.getExpense = async (req, res, next) => {
  const expense = await expenseSchema.findById(req.params.expenseId);
  return res.status(200).json({ message: "Expense details", expense });
};

module.exports.update = async (req, res, next) => {
  let requestBody = req.body;
  const expense = await expenseSchema.findById(req.params.expenseId);
  if (req.file) {
    let oldFileUrl = expense.imageUrl;
    //set new url
    requestBody["imageUrl"] = req.file.path.replace(/\\/g, "/");
    // remove the old file
    fileHelper.deleteFile(oldFileUrl);
  }
  let newExpenseObj = Object.assign(expense, requestBody);
  const expenseUpdated = await expenseSchema.findByIdAndUpdate(
    { _id: req.params.expenseId },
    newExpenseObj,
    { new: true, useFindAndModify: false }
  );
  return res
    .status(200)
    .json({ message: "Expense updated", expense: expenseUpdated });
};

module.exports.delete = async (req, res, next) => {
  expenseSchema
    .findById(req.params.expenseId)
    .then((expense) => {
      if (!expense) {
        return res.status(200).json({ error: "Expense Not Found" });
      }
      if (expense.imageUrl) {
        fileHelper.deleteFile(expense.imageUrl);
      }
      return expenseSchema.deleteOne({ _id: req.params.expenseId });
    })
    .then(() => {
      console.log("expense deleted");
      res.status(200).json({ error: "expense deleted" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports.getExpenseForMonth = async (req, res, next) => {
  let params = JSON.parse(req.query.month);
  // console.log(req.query);
  let startDate = params.startDate;
  let endDate = params.endDate;
  // console.log("dates1->", new Date(startDate));
  // console.log("dates2->", new Date(endDate));
  const expenses = await expenseSchema.find({
    createdDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });
  let totalExpense = expenses.reduce((expenseAmount, expense) => {
    return (expenseAmount += parseInt(expense.max_amount));
  }, 0);
  return res.status(200).json({ message: "Total expenses", totalExpense });
};
function handleError(error) {
  return {
    status: false,
    message: "Error while creating a expense",
    error: error.message,
  };
}
