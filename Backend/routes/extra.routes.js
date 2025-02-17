const express = require('express');
const router = express.Router();
const extraController = require('../controllers/extra.controller');
const { body } = require('express-validator');


 router.post('/send-message', extraController.sendSupportMessage);
 router.post('/feedback', extraController.sendFeedback);

module.exports = router;
