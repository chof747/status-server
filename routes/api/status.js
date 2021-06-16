var express = require('express');
var router = express.Router();

const Messages = require('../../models/messages');
const alertlevelchange = require('../../modules/mqtt/messages/alertlevelchange');
const resolutionrequest = require('../../modules/mqtt/messages/requestresolution');

const datadir = process.env.DATADIR;

/* MIDDLEWARE */
//------------------------------------------------------------------------------------
router.use(function (req, res, next) {

  req.messages = Messages.read();
  req.mqtt = req.app.get('mqttClient');
  alertlevelchange(req.mqtt, req.messages.getNewAlertLevel(), undefined);
  next();
});

//------------------------------------------------------------------------------------
function scrollHelper(req, res, up) {

  const current = req.params.current;
  var payload = null;

  if ((current !== undefined) && (req.messages.hasMessage(current))) {
      payload = req.messages.scrollFrom(current, up);
  } else if (current === undefined) {
      payload = req.messages.first();
  }

  if (payload) {
    res.status(200);
    res.setHeader('X-next-id', payload.id);
    res.send(JSON.stringify(payload));  
  }
  else {
    res.status(404).send(`Id "${current}" not found!`);
  }
}

/* GET */
//------------------------------------------------------------------------------------
router.get('/', function (req, res, next) {
  
  scrollHelper(req, res);
  next();

});

//------------------------------------------------------------------------------------
router.get('/:current&next', function (req, res, next) {
  
  scrollHelper(req, res, true);
  next();

});

//------------------------------------------------------------------------------------
router.get('/:current&prev', function (req, res, next) {
  
  scrollHelper(req, res, false);
  next();

});

/* POST */
//------------------------------------------------------------------------------------
router.post('/:id', function (req, res, next) {
  const id = req.params.id;
  const payload = req.body;

  if (req.messages.add(id, payload)) {
    alertlevelchange(req.mqtt, req.messages.getNewAlertLevel(), payload.expires);
    req.messages.write();
    res.setHeader('Location', id);
    res.status(201).send();
  } else {
    res.status(404).send();
  }
})

//------------------------------------------------------------------------------------
router.post('/accept/:id/:response?', function(req, res, next) {

  const id = req.params.id;
  const response = req.params.response;

  console.log(`Accepting message id = ${id} with response = ${response}`);

  if ((undefined  === response) || 
      (resolutionrequest(req.mqtt, id, response))) {

    if (req.messages.delete(id)) {
      req.messages.write();
      alertlevelchange(req.mqtt, req.messages.getNewAlertLevel(),undefined);
      res.status(200);
    } else {
      res.status(404);
    }
  } else {
    res.status(500);
  }

  res.send();

});

module.exports = router;
