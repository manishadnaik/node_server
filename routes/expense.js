const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");
const { validateExpense } = require("../middlewares/expense-validate");
const { uploadFile } = require("../middlewares/upload");

router.get("/get-expense-by-month", expenseController.getExpenseForMonth);

router.get("/", expenseController.get);

router.post(
  "/",
  // validateExpense,
  uploadFile("app-images/expense", "image"),
  expenseController.create
);

router.get("/:expenseId", expenseController.getExpense);

router.put(
  "/:expenseId",
  // validateExpense,
  uploadFile("app-images/expense", "image"),
  expenseController.update
);

router.delete("/:expenseId", expenseController.delete);

module.exports = router;
