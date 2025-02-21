require('dotenv').config();
const mime = require('mime-types');
const multer = require('multer');
const randomstring = require('randomstring');

const SERVER_UPLOAD_PATH = process.env.SERVER_UPLOAD_PATH;

const md5 = require('md5');

const maxFileSize = 64 * 1024 * 1024; // 64mg
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SERVER_UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const hashIdSalt = randomstring.generate(64);
    const hashIdString = `file-${hashIdSalt}-${Date.now()}`;
    const hashId = md5(hashIdString);

    const ext = mime.extension(file.mimetype);
    const fileName = hashId + '.' + ext;
    req.uploadFileNameInServer = fileName;
    req.uploadFileNameExt = ext;
    req.uploadFileNameBeforeSave = file.originalname;
    req.uploadFileSize = parseInt(req.headers['content-length']) || 0;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    req.uploadFileNameInServerStatus = true;

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'INVALID_FILE_TYPE';
      req.uploadFileNameInServerStatusMessage = 'INVALID_FILE_TYPE';
      req.uploadFileNameInServerStatus = false;
      //return cb(error, false);
    }

    cb(null, true);
  },
});

module.exports = { upload };
