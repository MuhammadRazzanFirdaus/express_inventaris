const { response } = require('../helpers/response.formatter');
const Validator = require("fastest-validator");
const { Item, Loan, Return } = require('../models');
const { Op, where } = require('sequelize');
const v = new Validator();

module.exports = {
    createLoan: async (req, res) => {
        try{
            const { item_id, name, total_item, date } = req.body;

            const schema = {
                item_id: {type: "number", positive: true, integer: true},
                total_item: {type: "number", positive: true, integer: true},
                name: {type: "string", min: 3},
                date: {type: "date"}
            }

            const data = {
                item_id: Number(item_id),
                total_item: Number(total_item),
                name: name,
                date: new Date(date)
            }

            const validate = v.validate(data, schema);
            if(validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // ambil data item sesuai item_id, pastikan id sudah ada di table items
            const item = await Item.findByPk(item_id);
            if(!item) {
                return res.status(400).json(response(400, "Data item not found, please check [item_id] value"));
            }

            //memastikan data total_item yang dipinjam tidak lebih dari stock yang sudah ada
            if(data.total_item > item.stock) {
                return res.status(400).json(response(400, `Stock not available. Available only ${item.stock}`));
            }   

            const loan = await Loan.create(data);
            // update stok di item, kurangi jumlah pinjam
            const updateStock = await Item.update({
                stock : item.stock - data.total_item
            }, {
                where: {id: item_id}
            });
            const loanWithItem = await Loan.findByPk(loan.id,{include: Item});
            return res.status(201).json(response(201, "Created", loanWithItem));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    getLoans: async (req, res) => {
        try {
            const { page, limit } = req.query;
            // page : ambil data yang ada di halaman keberapa, limit munculin data nya berapa
            // offset : page 1 : 1-1 = 0: limitnya 10: 0 * 10 = 0 jadi offsetnya 0 
            const offset = (Number(page)-1) * Number(limit);
            // contoh : page 1 : 1-1 = 0 jadi limitnya itu 0 * 10 nah offsetnya itu ngikut dari hasil page-1 dikali si limit karena page-1 = 0 maka 0 * 10 hasilnya 0 jadi datanya dari 0 1 - 10 

            // count ambil semua jumlah data rows : ambil data
            const { count, rows } = await Loan.findAndCountAll({
                include: [ Item, Return],  // mengabil lebih dari satu relasi
                offset: Number(offset),
                limit: Number(limit)
            });

            
            const formatPagination = {
                data: rows,// data yang dimunculkan
                limit: limit,
                rows: (Number(offset)+1) + "-" + (Number(offset)+Number(rows.length)), // munculin angka 1 - 20 sesuai yang di ambil contoh : offsetnya 20 : (20+1) (20+10) : 21-30
                total: count, // jumlah data keseluruhan
                page: page, // sedang di halaman keberapa
            }
            // const loanAll = await Loan.findAll();
            // if (loans.length == 0) {
            //     return res.status(400).json(response(400, `Data unavailable, only available until ${loanAll.length}`))
            // }
            return res.status(200).json(response(200, "Success", formatPagination));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
}