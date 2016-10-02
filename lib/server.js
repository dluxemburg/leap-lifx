const express = require('express');

let app = express();
app.use(express.static('static'));
app.use(express.static('node_modules'));

app.get('/state', (req, res) => {
  res.json({on: false});
});

app.post('/on', (req, res) => {
  console.log('on');
});

app.listen(process.env.PORT || 5000);
