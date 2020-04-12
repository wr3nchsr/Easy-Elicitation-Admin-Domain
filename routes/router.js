var express = require('express');
var router = express.Router();

var admincontroller=require('../Controller/admincontroller');

console.log('Router Activated:....');

router.get('/login',admincontroller.login);


module.exports = router;