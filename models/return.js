'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Return extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Return.belongsTo(models.Loan, {
        foreignKey: "loan_id"
      });
    }
  }
  Return.init({
    loan_id: DataTypes.BIGINT,
    total_item: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Return',
  });
  return Return;
};