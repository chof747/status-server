var express = require('express');
var router = express.Router();

const SensorStates = require('../../models/sensorstates');


//****************************************************************************************
router.get("/", function(req, res, next) {
    res.send(JSON.stringify(req.states.getStatesOf(req.states.firstDeviceClass())));
    res.status(200);     
});

module.exports = router;