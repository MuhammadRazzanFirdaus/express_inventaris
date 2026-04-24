'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Loan.belongsTo(models.Item, {
        foreignKey: "item_id"
      });
      // relasi ke return
      Loan.hasOne(models.Return, {
        foreignKey: "loan_id"
      });
    }
  }
  Loan.init({
    item_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    total_item: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Loan',
  });
  return Loan;
};