
const multer = require("multer");
const fs = require('fs');
const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// module.exports=upload



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = "./images";
    fs.access(destination, (err) => {
      if (err) {
        // if directory does not exist, create it with permission '755'
        fs.mkdir(destination, { recursive: true, mode: 0o755 }, (err) => {
          if (err) throw err;
          cb(null, destination);
        });
      } else {
        cb(null, destination);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;