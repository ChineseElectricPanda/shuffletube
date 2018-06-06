module.exports = function(sequelize, DataTypes) {
  return sequelize.define('room', {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true
    }
  }, {
    tableName: 'room'
  });
}