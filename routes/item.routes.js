const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const itemController = require('../controllers/item.controller')

// route.httpMethod('/path', middleware, controller)
// prefix route didefinisikan di app.js jadi kalau path '/' sama dengan '/items'
// single('image') : ambil 1 file yang diupload di inputan image
router.post('/', upload.single('image'), itemController.createItem);
router.get('/', itemController.getItem);
// path dinamis pake (:) buat diambil req.params
router.get('/:id', itemController.showItem);
router.put('/:id', upload.single('image'), itemController.updateItem);
router.delete('/:id', itemController.deleteItem)

module.exports = router;