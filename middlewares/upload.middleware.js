
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const imagesDir = './images';
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

fs.chmodSync(imagesDir, 0o777);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports=upload




