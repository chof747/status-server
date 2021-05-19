var express = require('express');
var router = express.Router();
const fs = require('fs');
const Messages = require('../../models/messages');

router.use(function(req, res, next) {

  let rawdata = fs.readFileSync('/data/messages.json');
  let jsondata = JSON.parse(rawdata);
  let messages = new Messages(jsondata);
  req.messages = messages;
  next();
});

/* GET home page. */
router.get('/:current', function(req, res, next) {
  const current = req.params.current;

  if (req.messages.hasMessage(current)) {
    res.send(JSON.stringify(req.messages.next(current)));
  }
  else {
    res.status(404).send(`Id "${current}" not found!`);
  }
  
});

module.exports = router;
