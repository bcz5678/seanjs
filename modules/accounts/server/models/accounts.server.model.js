"use strict";

module.exports = function(sequelize, DataTypes) {

  var Account = sequelize.define('account', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    address: DataTypes.STRING,
    address_2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    phoneHome: DataTypes.STRING,
    phoneMobile: DataTypes.STRING,
    phoneOffice: DataTypes.STRING,
    fax: DataTypes.STRING,
    mainDescription: DataTypes.TEXT,
    userType: DataTypes.INTEGER
  }, {
    associate: function(models) {
      Account.belongsTo(models.user);
    }
  });
  return Account;
};