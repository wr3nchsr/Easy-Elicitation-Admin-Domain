var adminmodel = require('../Model/adminModel');

exports.login = function (req, res) {
    adminmodel.login(req, res, loggedin);
};

loggedin = function (req, res, checkstate) {
   
    if (checkstate) {
        res.render("addAdmin");
    }
    else {
        res.send("wrong password")
        res.redirect('/');
    }
}
exports.checkemail = function(req,res){
    adminmodel.checkemailexistance(req,res)
}
exports.insertnewSystemAdmin = function (req,res)
{
    adminmodel.insertnewSystemAdmin(req,res,afterinsert)
};
exports.sendresetpasswordemail = function(req,res){
    adminmodel.forgetpassword(req,res)
}
exports.resetpassword = function(req,res){
    adminmodel.resetpassword(req,res)
}
afterinsert=function(req,res){
        
    res.render("addAdmin");
}
exports.deleteSystemAdmin= function(req,res)
{
   adminmodel.deleteSystemAdmin(req,res,afterdelete);
};
afterdelete=function(req,res){
      res.redirect('/getalladmins');
}

exports.getAllSystemAdmins= function(req,res)
{
   adminmodel.getAllSystemAdmins(req,res,getAllAdmins);
};

getAllAdmins = function (req,res,result)
{
    res.render('viewalladmins',{
        result:result
    });
}
exports.editpassword= function(req,res)
{
    adminmodel.editpassword(req,res)
}



