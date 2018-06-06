const db = require('../model/db');
const Sequelize = require('sequelize');

const cache = {};

function getRoom(req, res) {
  const roomId = req.params.id;
  if(!roomId) {
    return res.status(400).send('Must specify room ID');
  }
  // Check the cache for the room data first
  if(cache[roomId]) {
    return res.status(200).send(cache[roomId]);
  }

  db.Room.findOne({
    include: [{
      model: db.Track
    }],
    where: {
      id: roomId
    }
  })
  .then(room => {
    if(!room) {
      return res.status(404).send('Room not found')
    } else {
      cache[roomId] = room;
      return res.status(200).send(room);
    }
  })
}

function addTrack(req, res) {
  const roomId = req.params.id;
  let url = req.body.url;
  if(!roomId) {
    return res.status(400).send('Must specify room ID');
  } else if(!url) {
    return res.status(400).send('Must specify URL');
  }
  url = parseVideoId(url);
  if(!url) {
    return res.status(400).send('Invalid YouTube URL');
  }
  db.Track.create({
    roomId: roomId,
    url: url,
    timesPlayed: 0
  })
  .then(track => {
    // Add track to cached room data
    if(cache[roomId]) {
      cache[roomId].tracks.push(track);
    }
    return res.sendStatus(202);
  })
  .catch(Sequelize.UniqueConstraintError, err => {
    return res.status(409).send('Track is already in playlist');
  })
}

function removeTrack(req, res) {
  return res.status(400).send('Not implemented')
}

function createRoom(req, res) {
  const roomId = makeId(5);
  db.Room
    .create({ id: roomId })
    .then(room => {
      res.status(201).send(room.id);
    })
}

module.exports = { getRoom, addTrack, removeTrack, createRoom }

// Random room ID generator
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeId(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Parse Youtube URL to video ID
// Reference https://stackoverflow.com/a/8260383
function parseVideoId(url){
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length==11)? match[1] : false;
}