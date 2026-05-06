const multer = require("multer")
// path : agar bisa mengakses folder file project
const path = require("path")

// proses upload multer disimpan di middleware karena :
// middleware : penghubung antara (route -> middleware -> controller)
// sebelum file di akses controller, di middleware di proses dulu agar siap digunakan

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // file yang diupload akan disimpan di folder project ini bagian upload
    cb(null, path.join(__dirname, "../uploads"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // ngambil .jpg/.png dari nama asli file
    const ext = path.extname(file.originalname);
    // uniqueSuffix isinya nama file random, ext isinya .jpg jadi perlu digabung
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name)
  }
})

module.exports = multer({ storage: storage })