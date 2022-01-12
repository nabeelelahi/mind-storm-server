const multer = require('multer')

const root = __dirname
  .replace(/[\\]/gim, '/')
  .replace('/backend/app/config', '/backend')

const storage = multer.diskStorage({
  destination: `${root}/public/uploads/`,
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: 52428800
})

module.exports = { upload }
