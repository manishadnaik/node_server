const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const app = express();
var port = process.env.PORT || 1000;
const MONGODB_URI = "mongodb://127.0.0.1:27017/react-practical-test";
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
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
app.use(
  session({
    secret: "my-secret",
    cookie: { maxAge: 1 * 60 * 1000 },
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// send csrf along with other variables on each response
// app.use(csrf);
app.use(function (req, res, next) {
  // set the params to be available in all the views
  (res.locals.isAuthenticated = req.session.isLoggedIn),
    (res.locals.user = req.session.user),
    // (res.locals.csrfToken = req.csrfToken());
    next();
});

// using common middleware to store the user object in req as user retrived from session is not full user object
app.use(function (req, res, next) {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use(authRoutes);
app.use("/categories", categoryRoutes);
app.use("/expenses", expenseRoutes);

const errorController = require("./controllers/errorController");
const User = require("./models/user");
const mongoose = require("mongoose");

// showing the 500 page on error
app.use((error, req, res, next) => {
  res.status(500).json(error);
});
// handling url not found||404 page
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("connected to mongo..");
    app.listen(port, () => console.log(`App listening on port: ${port}`));
  })
  .catch((error) => {
    console.error(error);
  });

// run application with url http://localhost:5000/

//manisha.naik@thegatewaycorp.co.in
