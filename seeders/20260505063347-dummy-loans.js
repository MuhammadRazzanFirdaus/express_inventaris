'use strict';
const {Item } = require("../models")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // ambil data items semua, untuk akses idnya buat FK item_id
    const items = await Item.findAll();
    // loop sebanyak 20 data
    let dummyData = [];
    for (let index = 1 ; index <= 20 ; index++) {
      // mengambil secara acak id dari data items
      const itemId = items[Math.floor(Math.random()*items.length)];
      // mathRandom membuat angka 0-1 termasuk desimal, itemlength itung jumlah items
      // contoh : hasil random 0.5, length itemnya 3
      // o.5 * 3 = 1.5 : kemudian di Math.floor diambil angka sebelum koma = 1 jadi item_id atau 0.9 * 3 = 2.7 jadi item_idnya2 atau 3
      let data = {
        item_id: itemId.id,
        name: `Peminjam ke-${index}`,
        total_item: 1,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      dummyData.push(data); //simpan data ke array
    }
    // array di insert
    await queryInterface.bulkInsert('loans', dummyData);
  },

  async down (queryInterface, Sequelize) {
    // kosongkan data
    await queryInterface.bulkDelete('Loans', null, {})
  }
};
