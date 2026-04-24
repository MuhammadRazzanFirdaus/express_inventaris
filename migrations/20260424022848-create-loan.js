'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      item_id: {
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      total_item: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // mendefinisikan FK
    await queryInterface.addConstraint("Loans", {
      fields: ["item_id"], // column FK
      type: "foreign key",
      name: "fk_custom_item_id",
      references: { // PK nya dimana
        table: "Items",
        field: "id"
      },
      onDelete: 'CASCADE', // Jika data PK dihapus data FK ikut juga terhapus
      onUpdate: 'CASCADE', // Jika data PK di update data FK ikut berubah
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Loans');
  }
};