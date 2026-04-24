require("dotenv").config()

module.exports = {
    // disimpan disini agar nanti saat dipanggil di controller atau lainnya pakai file ini
    web_name: process.env.WEB_NAME,
    web_url: process.env.BASE_URL,
    auth_secret: process.env.AUTH_SECRET
}