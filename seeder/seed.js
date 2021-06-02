var seeder = require("mongoose-seed");
const MONGODB_URI = "mongodb://127.0.0.1:27017/react-practical-test";
// Connect to MongoDB via Mongoose
seeder.connect(MONGODB_URI, function () {
  // Load Mongoose models
  seeder.loadModels(["./models/user", "./models/category"]);

  // Clear specified collections
  seeder.clearModels(["User", "Category"], function () {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });
});

// Data array containing seed data - documents organized by Model
var data = [
  {
    model: "User",
    documents: [
      {
        _id: "60a7e8a650485b5ec8471561",
        name: "React Test",
        email: "reacttest@gmail.com",
        password:
          "$2a$12$C22q68Vqmv69vNEn/6e7iOOQUGemLKiRGWAymkqpIXR4yrzh/bp6.",
      },
    ],
  },
  {
    model: "Category",
    documents: [
      {
        title: "Sports",
        description:
          "You can edit this details for cooking, edit to add the max amount you want to spend for this",
        userId: "60a7e8a650485b5ec8471561",
        max_amount: 0,
        is_default: true,
      },
      {
        title: "Cooking",
        description: "You can edit this details for Cooking",
        userId: "60a7e8a650485b5ec8471561",
        max_amount: 0,
        is_default: true,
      },
      {
        title: "Shopping",
        description: "You can edit this details for Shopping",
        userId: "60a7e8a650485b5ec8471561",
        max_amount: 0,
        is_default: true,
      },
      {
        title: "House Hold Activities",
        description:
          "You can edit this expense details for House Hold Activities",
        userId: "60a7e8a650485b5ec8471561",
        max_amount: 0,
        is_default: true,
      },
    ],
  },
];
