"use strict";

module.exports = function(sequelize, DataTypes) {

  var Gig = sequelize.define('gig', {
   id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    feelingTags: DataTypes.TEXT,
    preferredTalent: DataTypes.TEXT,
    gigType: DataTypes.STRING,
    acceptedActors: DataTypes.STRING,
    acceptedScript: DataTypes.STRING,
    acceptedEditor: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    associate: function(models) {
      Gig.belongsTo(models.user);
    }
  });
  return Gig;
};