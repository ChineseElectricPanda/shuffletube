module.exports = function(sequelize, DataTypes) {
  return sequelize.define('track', {
    roomId: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'uniqueTracks'
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'uniqueTracks'
    },
    timesPlayed: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
}