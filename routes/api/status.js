var express = require('express');
var router = express.Router();
const Messages = require('../../models/messages');

const datadir = process.env.DATADIR;

router.use(function(req, res, next) {

  req.messages = Messages.read();
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
