var express = require('express');
var router = express.Router();

var admincontroller=require('./Controller/admincontroller');
var companyadmincontroller = require('./Controller/companyadmincontroller');


console.log('Router Activated:....');

router.get('/', function (req, res) {
   if(req.session.username){
      res.redirect('/newadmin')
   }
   else{
    res.render('LoginAdmin')
   }
})
router.get('/forgotpassword',function(req,res){
   res.render('forgotpasswordpage')
})
 router.get('/newadmin',function(req,res){
    res.render('addadmin');
 })
 router.get('/editpasswordpage',function(req,res){
    res.render('Editpassword')
 })
 router.get('/newcompanyadmin',function(req,res){
    res.render('addcompanyadmin');
 })
 router.get('/logout',function(req,res){
    req.session.destroy();
   
    res.redirect('/');
 })
 router.get('/resetpassword/:token',function(req,res){
    var token = req.params.token
    var email = req.query.email
    console.log(token)
   res.render('newpassword',{
      token:token,
      email:email
   })

 })
 
/**----------SYSTEM ADMIN---------- **/
router.get('/getalladmins',admincontroller.getAllSystemAdmins);
router.post('/login',admincontroller.login);
router.post('/insertnewadmin',admincontroller.insertnewSystemAdmin);
router.get('/deleteadmin',admincontroller.deleteSystemAdmin);
router.post('/editpassword',admincontroller.editpassword)
router.get('/checkemail',admincontroller.checkemail)
router.get('/sendresetpasswordemail',admincontroller.sendresetpasswordemail)
router.post('/resetpassword',admincontroller.resetpassword)






/**----------COMPANY ADMIN---------- **/
router.get('/getallcompanyadmins',companyadmincontroller.getallCompanyAdmin);
router.get('/deletecompanyadmin',companyadmincontroller.deleteCompanyAdmin);
router.post('/insertcompanyadmin',companyadmincontroller.insertCompanyAdmin);
router.get('/checkemailcompany',companyadmincontroller.checkemail)



module.exports = router;
