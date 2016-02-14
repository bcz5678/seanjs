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

module.exports = function(sequelize, DataTypes) {

  var TalentProfile = sequelize.define('talentProfile', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    headline_1: DataTypes.TEXT,
    headline_2: DataTypes.TEXT,
    mainDescription: DataTypes.TEXT,
    age: DataTypes.INTEGER,
    height: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    hairColor: DataTypes.STRING,
    hairType: DataTypes.STRING,
    languages: DataTypes.STRING,
    accents: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    characterTags : DataTypes.STRING
  }, {
    associate: function(models) {
      TalentProfile.belongsTo(models.user);
    }
  });
  return TalentProfile;
};