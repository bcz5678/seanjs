"use strict";

module.exports = function(sequelize, DataTypes) {

  var Talent = sequelize.define('talent', {
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
    ethnicity: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    characterTags : DataTypes.STRING,
    physicalType : DataTypes.STRING,
    topImage : DataTypes.STRING,
    mediaArray : DataTypes.TEXT
  }, {
    associate: function(models) {
      Talent.belongsTo(models.user);
    }
  });
  return Talent;
};