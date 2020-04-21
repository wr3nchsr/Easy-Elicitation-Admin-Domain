var adminmodel = require('../Model/adminModel');

exports.login = function (req, res) {
    var email = req.query.email;
    var password = req.query.password;
    adminmodel.login(req, res, email, password, loggedin);
};

loggedin = function (req, res, checkstate) {
   
    if (checkstate) {
        res.send("LOGGED IN SUCC" + req.query.email + " " + req.query.password);
    }
    else {
        res.redirect('/');
    }
}
exports.insertnewSystemAdmin = function (req,res)
{
    adminmodel.insertnewSystemAdmin(req,res,callback);
};

exports.deleteSystemAdmin= function(req,res)
{
   adminmodel.deleteSystemAdmin (req,res,callback);
};

exports.getAllSystemAdmins= function(req,res)
{
   adminmodel.getAllSystemAdmins (req,res,getAllAdmins);
};

getAllAdmins = function (req,res,result)
{

    // show all result of system admin 
}



