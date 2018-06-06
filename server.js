const express = require('express');
const bodyParser = require('body-parser');

const shuffletube = require('./app/routes/shuffletube');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/src'));

router.route('/shuffletube/createroom')
  .post(shuffletube.createRoom);
router.route('/shuffletube/:id')
  .get(shuffletube.getRoom)
  .post(shuffletube.addTrack)
  .delete(shuffletube.removeTrack);

app.use('/api', router);

// Route all other requests to index.html
app.get('/*', (req, res) => {
  res.sendFile('index.html', {root: './src'});
})

var server = app.listen((process.env.PORT || 3001), () => {
  console.log('Server started on port ' + (process.env.PORT || 3001));
});
