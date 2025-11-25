'use strict';

const express = require('express');
const { getAqi } = require('../controllers/aqiController');

const router = express.Router();

router.get('/aqi', getAqi);

module.exports = router;
