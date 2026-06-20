
  const multer = require('multer');
  const path = require('path');

  // Where and under what name the file is saved
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), // all files go in the 'uploads/' folder
    filename: (req, file, cb) => {
      // unique name: time + random number + original extension (.pdf/.jpg)
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    }
  });

  // Only allow these file types (reports/photos)
  function fileFilter(req, file, cb) {
    const allowed = /pdf|jpg|jpeg|png|doc|docx/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ok) cb(null, true);
    else cb(new Error('Only pdf/jpg/png/doc files are allowed'));
  }

  // Final upload setting: files up to 5 MB
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
  });

  module.exports = upload;
