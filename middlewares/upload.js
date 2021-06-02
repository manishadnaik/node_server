const multer = require("multer");

const getStorage = (directory) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directory); // folder should exist in advance
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });
};
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// const upload = multer({ dest: "app-images/category" }).single("image");
const uploadFile = (directory, field) => {
  let upload = multer({
    storage: getStorage(directory),
    fileFilter: fileFilter,
  });
  return upload.single(field);
};
module.exports.uploadFile = uploadFile;
