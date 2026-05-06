const { response } = require('../helpers/response.formatter');
const Validator = require("fastest-validator");
const { Item, Loan, Return } = require('../models');
const { Op, where } = require('sequelize');
const v = new Validator();

module.exports = {
    createReturn: async (req, res) => {
        try {
            // isi {...} disamakan dengan isi si modelnya
            const { loan_id, total_item, notes, date } = req.body;

            const schema = {
                loan_id: { type: "number", positive: true, integer: true },
                total_item: { type: "number", positive: true, integer: true },
                notes: { type: "string" },
                date: { type: "date" }
            }

            const data = {
                loan_id: Number(loan_id),
                total_item: Number(total_item),
                // karena ga wajib (opsional) jadi kasih kondisi kalau kosong isinya "-"
                notes: notes ?? "-",
                date: new Date(date)
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            const loan = await Loan.findByPk(loan_id, { include: Item });
            // kalau data peminjaman tidak ada
            if (!loan) {
                return res.status(400).json(response(400, "Validasi Error", "Data loan not found"))
            }
            // data total item pengembalian tidak boleh kurag dari peminjaman
            if (data.total_item > loan.total_item) {
                return res.status(400).json(response(400, "Validasi Error", "Total return Item more than loan Item"));
            }

            // menambahakan data return
            const returnData = await Return.create(data); // value untuk mereturn sudah ada di const data semuanya
            // updateStock : stock sebelumnya + jumlah return
            const updateStock = await Item.update({
                // loan.Item : mengambil relasi Item include dari loan, ambil stock nya
                stock: loan.Item.stock + data.total_item
            }, {
                where: { id: loan.Item.id } // data id item adanya di relasi Item dari data loan
            });
            // kembalikan data item, peminjaman, dan pengembalian

             const loanWithItemReturn = await Loan.findByPk(loan_id, {include: [Item, Return]});
             return res.status(201).json(response(201, "Created", loanWithItemReturn))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}