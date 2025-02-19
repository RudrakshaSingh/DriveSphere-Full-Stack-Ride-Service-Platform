const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');

router.post('/initiate-payment',authMiddleware.authUser, paymentController.initiatePayment);
router.post('/verify-payment',authMiddleware.authUser, paymentController.verifyPayment);

module.exports = router;