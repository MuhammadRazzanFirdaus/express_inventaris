'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.hasMany(models.Loan, {
        foreignKey: "item_id"
      });
    }
  }
  Item.init({
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    image: {
      type: DataTypes.STRING,
      get() {
        // getter untuk memanipulasi data untuk responsenya
        const rawValue = this.getDataValue('image');
        // image yang di db cuman filename, di response jadi link yang bisa dibuka/ditampilkan gambarnya
        return rawValue ? `http://localhost:3000/uploads/${rawValue}` : null;
      },
    }
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};