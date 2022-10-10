const express = require('express');
const router =  express.Router();

const readfile = require('../controller/read');
const summaryfile = require('../controller/pendingPayments');
const getupdatefile = require('../controller/ordersCollectionUpdate');
const getorderupdatefile = require('../controller/orderUpdate');

router.get('/read', readfile.readdata);
router.get('/pendingPayments', summaryfile.getPendingPaymentsData);
router.get('/getUpdate', getupdatefile.getUpdate);
router.get('/onUpdate', getorderupdatefile.onUpdate);


module.exports = router;