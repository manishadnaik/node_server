const categorySchema = require("../models/category");
const fileHelper = require("../util/file");

module.exports.getCategories = async (req, res, next) => {
  const categories = await categorySchema.find();
  return res.status(200).json({ message: "List of categories", categories });
};

module.exports.createCategory = async (req, res, next) => {
  const categoryData = {
    title: req.body.title,
    max_amount: req.body.max_amount,
    imageUrl: req.file ? req.file.path.replace(/\\/g, "/") : "",
    userId: req.body.userId,
    description: req.body.description,
  };
  const categoryObj = new categorySchema(categoryData);
  const category = await categoryObj.save();
  return res.status(201).json({ message: "Created a category", category });
};

module.exports.getCategory = async (req, res, next) => {
  const category = await categorySchema.findById(req.params.categoryId);
  const expenses = await categorySchema.getExpenses(req.params.categoryId);

  return res
    .status(200)
    .json({ message: "Category details", category, expenses });
};
module.exports.update = async (req, res, next) => {
  let requestBody = req.body;
  const category = await categorySchema.findById(req.params.categoryId);
  if (req.file) {
    let oldFileUrl = category.imageUrl;
    //set new url
    requestBody["imageUrl"] = req.file.path.replace(/\\/g, "/");
    // remove the old file
    fileHelper.deleteFile(oldFileUrl);
  }
  let newCategoryObj = Object.assign(category, requestBody);
  // console.log("newCategoryObj", newCategoryObj);
  const categoryUpdated = await categorySchema.findByIdAndUpdate(
    { _id: req.params.categoryId },
    newCategoryObj,
    { new: true, useFindAndModify: false }
  );
  return res
    .status(200)
    .json({ message: "Category updated", category: categoryUpdated });
};

module.exports.deleteCategory = async (req, res, next) => {
  // await categorySchema.deleteOne({ _id: req.params.categoryId });
  // return res.status(200).json({ message: "Category deleted" });
  let deletedExpenses = await categorySchema
    .getExpenses(req.params.categoryId)
    .then((res) => {
      // remove file
      res.map(async (expense, index) => {
        if (expense.imageUrl) {
          fileHelper.deleteFile(expense.imageUrl);
        }
        return await categorySchema.removeExpense(expense);
      });
    });
  categorySchema
    .findById(req.params.categoryId)
    .then((category) => {
      if (!category) {
        return res.status(200).json({ error: "Category Not Found" });
      }
      if (category.imageUrl) {
        fileHelper.deleteFile(category.imageUrl);
      }
      return categorySchema.deleteOne({ _id: req.params.categoryId });
    })
    .then(() => {
      console.log("Category deleted");
      res.status(200).json({ error: "Category deleted" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
