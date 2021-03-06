function errorHandler(err, req, res, next) {
//****************************************************************************************

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.send(err.message);
}

function prepareServer() {
//****************************************************************************************

  const express = require('express');
  const path = require('path');
  const logger = require('morgan');
  
  var app = express();

  //add middleware
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  return app;
}

//****************************************************************************************
function startUpMqtt(app) {

    const mqtt = require('./modules/mqtt');
    app.set('mqttClient', mqtt());
}

//****************************************************************************************
function loadSensorStatesAndConncetToHA() {
  const SensorStates = require('./models/sensorstates')
  const haws = require('./modules/ws')
  var states = new SensorStates();
  haws(states.update.bind(states));
  return states;
}

const dotenv = require('dotenv');
dotenv.config();

app = prepareServer();
var states = loadSensorStatesAndConncetToHA();

const statusRouter = require('./routes/api/status.js');
var sensorsRouter = require('./routes/api/sensors');

startUpMqtt(app);
app.use('/api/sensors', function(req, res, next) {

  req.states = states;
  next();

});

app.use('/api/status', statusRouter);
app.use('/api/sensors', sensorsRouter);

app.use(errorHandler);

module.exports = app;
