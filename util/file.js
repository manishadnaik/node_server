const fs = require("fs");

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  }
};

module.exports.deleteFile = deleteFile;
