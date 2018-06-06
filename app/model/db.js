const Sequelize = require('sequelize');

const sequelize = new Sequelize('shuffletube', null, null, {
  dialect: 'sqlite', 
  storage: 'shuffletube-db.sqlite',
  logging: false
})

const Room = require('./room')(sequelize, Sequelize);
const Track = require('./track')(sequelize, Sequelize);

Track.belongsTo(Room, { foreignKey: Track.rawAttributes.roomId });
Room.hasMany(Track, { foreignKey: Track.rawAttributes.roomId });

const syncedPromise = sequelize
  .authenticate()
  .then(() => {
    console.log('Syncing Database...');
    // Environment variables are stored as strings
    return sequelize.sync({force: false})
  })
  .then(() => {
    console.log('Database Synced');
  })

module.exports = {
  Room,
  Track,
  sequelize
}