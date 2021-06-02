const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { validateCategory } = require("../middlewares/category-validate");
const { uploadFile } = require("../middlewares/upload");
const isAuthenticated = require("../middlewares/is-auth");

router.use(isAuthenticated);

router.get("/", categoryController.getCategories);

router.post(
  "/",
  // validateCategory,
  uploadFile("app-images/category", "image"),
  categoryController.createCategory
);

router.get("/:categoryId", categoryController.getCategory);

router.put(
  "/:categoryId",
  // validateCategory,
  uploadFile("app-images/category", "image"),
  categoryController.update
);

router.delete("/:categoryId", categoryController.deleteCategory);

module.exports = router;
