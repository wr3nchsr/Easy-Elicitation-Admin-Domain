var adminmodel = require('../Model/adminModel');

exports.login = function (req, res) {
    var email = req.query.email;
    var password = req.query.password;
    adminmodel.login(req, res, email, password, loggedin);
};

loggedin = function (req, res, checkstate) {
   
    if (checkstate) {
        res.render("addAdmin");
    }
    else {
        res.redirect('/');
    }
}
exports.insertnewSystemAdmin = function (req,res)
{
    adminmodel.insertnewSystemAdmin(req,res,afterinsert)
};
afterinsert=function(req,res){
        
    res.render("addAdmin");
}
exports.deleteSystemAdmin= function(req,res)
{
   adminmodel.deleteSystemAdmin(req,res,afterdelete);
};
afterdelete=function(req,res){
      res.redirect('/router/getalladmins');
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



