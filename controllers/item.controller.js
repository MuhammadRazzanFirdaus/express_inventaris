const { response } = require('../helpers/response.formatter');
const { where, or } = require("sequelize");
const Validator = require("fastest-validator");
const { Item } = require('../models');
const { Op } = require('sequelize');
const v = new Validator();
const fs = require('fs'); // file system melakukan sesuatu yang berhubungan dengan lokasi file
const path = require('path');
const { off } = require('cluster');

module.exports = {
    createItem: async (req, res) => {
        try {
            // ambil inputan (payload) : req.body
            const { name, stock } = req.body;
            const { image } = req.file;

            // validasi
            const schema = {
                name: { type: "string", min: 3 },
                stock: { type: "number", positive: true, integer: true }
            }

            // menyiapkan data yang akan divalidasi 
            const data = {
                name: name, // fieldDatabase: namaDariReq
                stock: Number(stock) // karena req.body json berupa string, jadi stock diubah ke tipe number pake Number
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                // jika hasil validate ada error
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // cek jika image tidak diupload  ( req.file: mengambil input file)
            if (!req.file) {
                return res.status(400).json(response(400, "Validasi Error", "Image Not Found"));
            }

            // proses menyimpan data melalui ORM sequelize
            const item = await Item.create({
                name: data.name, // email dari objek data yang divalidasi sebelumnya
                stock: data.stock,
                image: req.file.filename // ambil filename hasil dari middleware multer
            });
            return res.status(201).json(response(201, 'created', item));

        } catch (error) {
            // penanganan error codingan di try
            // res : parameter fungsi yang digunakan untuk memberikan response asli
            // response : method dari helpers formatter untuk format hasil outputnya, outputnya dalam bentuk json
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    getItem: async (req, res) => {
        try {
            // req.query : ambil params di postman/ambil data acuan untuk search/sort
            // sortBy : ngurutin berdasarkan apa
            // order ; ASC/DESC 
            const { name, sortBy, order, page, limit } = req.query;
            const offset = (Number(page)-1) * Number(limit);
            const { count, rows } = await Item.findAndCountAll({
                where: name ? {
                    name: {
                        [Op.like]: `%${name}%` // mencari yang mirip
                    }
                } : {}, // cari berdasarkan field name di db dari name req.query, jika ga ada name nya berarti ga search apa apa terus munculin semuanya

                order: sortBy && order ? [[sortBy, order]] : [],
                offset: Number(offset),
                limit: Number(limit)
                });
            const formatPagination = {
                data: rows,
                limit: limit,
                rows: (Number(offset) + 1) + "-" + (Number(offset)+Number(rows.length)),
                total: count,
                page: page
            }
            return res.status(200).json(response(200, 'Success', formatPagination));
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    showItem: async (req, res) => {
        try {
            // req.params : ambil path dinamis, /items/3 ambil dari angka 3 (id)
            const { id } = req.params;
            // findByPk : mencari berdasarkan primary key (id)
            const item = await Item.findByPk(id);
            // jika data yang dicari tidak ada di database (artinya angka id nya salah)
            if (!item) {
                return res.status(400).json(response(400, "Data [id] not found"));
            }
            return res.status(200).json(response(200, "Success", item));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    updateItem: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, stock } = req.body;
            const { image } = req.file;

            const schema = {
                name: { type: "string", min: 3 },
                stock: { type: "number", positive: true, integer: true }
            }

            const data = {
                name: name,
                stock: Number(stock)
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            const item = await Item.findByPk(id);
            if (!item) {
                return res.status(400).json(response(400, "Validasi Error", "Data not found"));
            }

            // kalau ada file baru, file lama dihapus
            if (req.file) {
                // karna image udah diganti jadi link di getter model, jadi ambil yang aslinya pake getDataValue
                const imageName = item.getDataValue('image');
                // cari image ke folder uploads
                const filePath = path.join(__dirname, '../uploads', imageName);
                // cek jika file ada di folder tersebut
                if (fs.existsSync(filePath)) {
                    // hapus file
                    fs.unlinkSync(filePath);
                }
            }

            // hasil dari update proses hanya true/false bukan data terbaru
            const updateProcess = await Item.update({
                name: data.name,
                stock: data.stock,
                // jika ada file baru, ambil filename baru, jika tidak ada ambil data asli tanpa link (nama gambar sebelumnya)
                image: (req.file ? req.file.filename : item.getDataValue('image'))
            }, {
                where: { id: id }
            });
            //ambil data baru yang udah diupdate
            const newItem = await Item.findByPk(id); // untuk dimunculkan
            return res.status(200).json(response(200, "Success", newItem));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;

            // mengambil data item untuk diambil gambar dan dihapus
            const item = await Item.findByPk(id);
            const imageName = item.getDataValue('image');
            // cari image ke folder uploads
            const filePath = path.join(__dirname, '../uploads', imageName);
            // cek jika file ada di folder tersebut
            if (fs.existsSync(filePath)) {
                // hapus file
                fs.unlinkSync(filePath);
            }
            const deleteProcess = await Item.destroy({
                where: { id: id }
            });
            return res.status(200).json(response(200, "Deleted"));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}