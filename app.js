const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var port = process.env.PORT || 1000;
// const MONGODB_URI = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
const MONGODB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@react-node.pi1ui.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// include csrf security token
const csrfProtection = require("csurf");
const csrf = csrfProtection();
const multer = require("multer");

const cors = require("cors");
var corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: "GET, PUT, POST, PATCH, DELETE",
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Request-with",
    "Accept",
    "Authorization",
    "content-type",
  ],
};

app.use(cors(corsOptions));
// app.use(cors());
// to encode all the body || form data in request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mutler for file upload configue ui path
app.use(
  "/app-images/category",
  express.static(path.join(__dirname, "app-images/category"))
);
app.use(
  "/app-images/expense",
  express.static(path.join(__dirname, "app-images/expense"))
);

var authRoutes = require("./routes/auth");
var categoryRoutes = require("./routes/category");
var expenseRoutes = require("./routes/expense");

app.use(authRoutes);
app.use("/categories", categoryRoutes);
app.use("/expenses", expenseRoutes);

const errorController = require("./controllers/errorController");
const mongoose = require("mongoose");

// showing the 500 page on error
app.use((error, req, res, next) => {
  res.status(500).json(error);
});
// handling url not found||404 page
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("connected to mongo..");
    app.listen(port, () => console.log(`App listening on port: ${port}`));
  })
  .catch((error) => {
    console.error(error);
  });

// run application with url http://localhost:5000/

//manisha.naik@thegatewaycorp.co.in
