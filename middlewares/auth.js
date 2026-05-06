const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response.formatter')
const { auth_secret } = require('../config/base.config')

module.exports = {
    // next : parameter, untuk melanjutkan req kalo udah di cek middlewarenya melanjutkan ke controller pake next
    checkToken: async (req, res, next ) => {
        // token diambil dari header
        const token = req.header('Authorization');
        if (!token) {
            // 401 : err untuk pengguna yang belum login (unauthorized)
            return res.status(401).json(response(401, "unauthorized", "Please login and try again!"));
        }
        try {
            // cek token aktif atau ngga
            const check = jwt.verify(token, auth_secret);
            // karena nanti pengguna perlu data identitas pengguna, panggil payload yang dikirim jwt.sign() di loginController dan simpan di req, data payload tersimpan di const check (hasil verify) ada {userId, name, email}
            req.user = check;
            next();
        } catch (error) {
            // jika terjadi error, ini hubungan nya dengan token jadi kash 401 suruh login lagi
            return res.status(401).json(response(401, "unauthorized", "Please login and try again!"));
        }
    }
}