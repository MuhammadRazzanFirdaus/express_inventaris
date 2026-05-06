const { response } = require('../helpers/response.formatter');
const { auth_secret } = require('../config/base.config')
const Validator = require("fastest-validator");
const passwordHash = require('password-hash');
const { where } = require('sequelize');
const { User } = require('../models');
const jwt = require('jsonwebtoken')
const v = new Validator();

module.exports = {
    login: async (req, res) => {
        try{
            const { email, password } = req.body;

            const schema = {
                email: {type: "string"},
                password: {type: "string"}
            }

            const data = {
                email: email,
                password: password
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // cek apakah email tersebut ada di table user
            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(400).json(response(400, "Validasi Error", "Email not found. Try again!"));
            }

            // mencocokan password yang diinput dan yang ada di hash (db)
            const checkPassword = passwordHash.verify(password, user.password);
            // jika ga cocok
            if (!checkPassword) {
                return res.status(400).json(response(400, "Validasi Error", "Password incorrect. Try again!"));
            }

            // kalau validasi berhasil buat jwt
            const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, auth_secret);
            if (!token) {
                return res.status(400).json(response(400, "Validasi Error", "Login Failed"));
            }

            // output
            const formatData = {
                data: user,
                token: token
            }

            return res.status(200).json(response(200, "Success", formatData));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}