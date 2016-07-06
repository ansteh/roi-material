'use strict';

const express        = require('express');
const app            = express();
const path           = require('path');
const fs             = require('fs');

app.use('/client', express.static(path.join(__dirname, '/client')));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

['FB', 'GOOG', 'AAPL'].forEach((name) => {
  app.get(`/${name}`, function(req, res) {
    fs.readFile(`resources/${name.toLowerCase()}.json`, 'utf8', (err, content) => {
      if(err) {
        res.status(404);
      } else {
        res.json(JSON.parse(content));
      }
    })
  });
});


const server = require('http').Server(app);

server.listen(3000, function(){
  console.log('listening on *:3000');
});
