var adminmodel = require('../Model/adminModel');
const bcrypt = require('bcryptjs');
var generator = require('generate-password');
const nodemailer = require("nodemailer");
var sendemail = require('../sendmail');
const crypto = require('crypto');
exports.login = async function (req, res) {
    var result = await adminmodel.getSystemAdminByEmail(req.body.email);
    if (result === null) {
        res.send("Invalid email or password");
    }
    else {
        //compare given password from req with the hashed password saved in database
        bcrypt.compare(req.body.password, result.password)
            .then(match => {
                if (!match) {
                    res.send("Invalid email or password");
                }
                else {
                    //Add admin name and email to the session
                    req.session.name = result.name;
                    req.session.email = result.email;
                    req.session.id = result.systemAdminId;
                    req.session.save()
                    res.send("successfully loggedin")

                }
            })
    }
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
exports.checkemail = function (req, res) {
    adminmodel.checkemailexistance(req, res)
}
exports.insertnewSystemAdmin = async function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    //generates password for the new admin
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    console.log(password)
    var hashedpassword = await bcrypt.hash(password, 12);
    await adminmodel.insertnewSystemAdmin(name, email, hashedpassword)
    var emailtext = "A new Account was created for you as a System admin \n your usename is:"
        + name + "\n your password is: " + password + "\n You can change the password anytime from your account \n"
    sendemail.sendToNewAdmin(email, "Easy Elicitation System admin Account", emailtext)   
    res.redirect('/newadmin')
}
exports.sendresetpasswordemail = function (req, res) {
    adminmodel.forgetpassword(req, res)
}
exports.resetpassword = function (req, res) {
    adminmodel.resetpassword(req, res)
}
afterinsert = function (req, res) {
    res.render("addAdmin");
}
exports.deleteSystemAdmin = function (req, res) {
    adminmodel.deleteSystemAdmin(req, res, afterdelete);
};
afterdelete = function (req, res) {
    res.redirect('/getalladmins');
}

exports.getAllSystemAdmins = function (req, res) {
    adminmodel.getAllSystemAdmins(req, res, getAllAdmins);
};

getAllAdmins = function (req, res, result) {
    res.render('viewalladmins', {
        result: result
    });
}
exports.editpassword = function (req, res) {
    adminmodel.editpassword(req, res)
}




