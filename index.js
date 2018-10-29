const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routers = require('./routers');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//mongodb conn
mongoose.connect('mongodb://localhost:27017/contacts',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//initialize body-parser
app.use(bodyParser.json());

//initialize routers
app.use('/api',routers);

//error middleware
app.use(function(err, req, res, next){
  res.status(422).send({err: err.message})
})

app.listen(5000, function(){
  console.log('express is listening request')
});
