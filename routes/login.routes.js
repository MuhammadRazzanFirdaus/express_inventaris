const express = require('express')
const router = express.Router()

const loginController = require('../controllers/login.controller')
const upload = require('../middlewares/upload')

// tidak menggunakan prefix karna nanti akan beda /login dan /logout
router.post('/login', upload.none(), loginController.login);

module.exports = router