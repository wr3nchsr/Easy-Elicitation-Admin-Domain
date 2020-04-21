var express = require('express');
var router = express.Router();

var admincontroller=require('../Controller/admincontroller');
var companyadmincontroller = require('../Controller/companyadmincontroller');


console.log('Router Activated:....');
/**----------SYSTEM ADMIN---------- **/
router.get('/getalladmins',admincontroller.getAllSystemAdmins);
router.get('/login',admincontroller.login);
router.get('/insertnewadmin',admincontroller.insertnewSystemAdmin);
router.get('/deleteadmin',admincontroller.deleteSystemAdmin);



/**----------COMPANY ADMIN---------- **/
router.get('/getallcompanyadmins',companyadmincontroller.getallCompanyAdmin);
router.get('/deletecompanyadmin',companyadmincontroller.deleteCompanyAdmin);
router.get('/insertcompanyadmin',companyadmincontroller.insertCompanyAdmin);



module.exports = router;