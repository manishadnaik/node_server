module.exports.get404 = (req, res, next) => {
  console.log(req.path);
  res.status(404).json({
    pageTitle: "404 Not Found",
    path: req.path,
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports.get500 = (req, res, next) => {
  res.status(500).json({
    pageTitle: "500 Internal server error",
    path: null,
    isAuthenticated: req.session.isLoggedIn,
  });
};
