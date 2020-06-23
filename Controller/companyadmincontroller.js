var companyAdminModel= require('../Model/companyAdminModel');

exports.getallCompanyAdmin = function (req, res) {
  companyAdminModel.getAllCompanyAdmins (req,res,getAllCompAdmin);
};

getAllCompAdmin = function (req,res,result)
{
    res.render('viewallcompany',{
        result:result
    })
}

exports.insertCompanyAdmin = function (req,res){
    companyAdminModel.insertnewCompanyAdmin(req,res,insertCompAdmin);
}

insertCompAdmin = function (req,res,result)
{
    res.render("addCompanyAdmin");
}

exports.deleteCompanyAdmin = function (req,res)
{
    companyAdminModel.deleteCompanyAdmin(req,res,deleteCompAdmin);
}

deleteCompAdmin=function(req,res,result)
{
    res.redirect('/getallcompanyadmins');
}
exports.checkemail = function(req,res){
    companyAdminModel.checkemailexistance(req,res)
}