var companyAdminModel= require('../Model/companyAdminModel');
const bcrypt = require('bcryptjs');
var generator = require('generate-password');
var sendemail = require('../sendmail');
exports.getallCompanyAdmin = async function (req, res) {
    var result = await companyAdminModel.getAllCompanyAdmins();
    res.render('viewallcompany', {
        result: result
    });
};
exports.insertCompanyAdmin = async function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    //generates password for the new admin
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    var hashedpassword = await bcrypt.hash(password, 12);
    var companyname=req.body.companyname;
    var ress= await companyAdminModel.insertnewCompanyAdmin(name, email, hashedpassword,companyname)
    var emailtext = "A new Account was created for you as a company admin \n your usename is:"
        + name + "\n your password is: " + password + "\n You can change the password anytime from your account \n"
    sendemail.sendToNewAdmin(email, "Easy Elicitation company admin Account", emailtext)
    res.render("addcompanyadmin");
}
exports.deleteCompanyAdmin = async function (req, res) {
    var result = await companyAdminModel.deleteCompanyAdmin(req.query.adminid);
    res.redirect('/getallcompanyadmins');
};
exports.checkemail = async function (req, res) {
    var result = await companyAdminModel.checkemailexistance(req.query.email)
    if (result.length == 0)
        res.send("email doesn't exist")
    else {
        res.send("email already exists")
    }
}
