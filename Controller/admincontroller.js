var adminmodel = require('../Model/adminModel');
const bcrypt = require('bcryptjs');
var generator = require('generate-password');
var sendemail = require('../sendmail');
const crypto = require('crypto');

exports.login = async function (req, res) {
    var result = await adminmodel.getSystemAdminByEmail(req.body.email);
    if (result[0] == null) {
        res.send("Invalid email or password");
    }
    else {
        //compare given password from req with the hashed password saved in database
        bcrypt.compare(req.body.password, result[0].password)
            .then(match => {
                if (!match) {
                    res.send("Invalid email or password");
                }
                else {
                    //Add admin name and email to the session
                    req.session.name = result[0].name;
                    req.session.email = result[0].email;
                    req.session.id = result[0].systemAdminId;
                    req.session.save()
                    res.send("successfully loggedin")

                }
            })
    }
};
exports.checkemail = async function (req, res) {
    console.log(req.query.email)
    var result = await adminmodel.getSystemAdminByEmail(req.query.email)
    if (result[0] == null)
        res.send("email doesn't exist")
    else {
        res.send("email already exists")
    }
}
exports.insertnewSystemAdmin = async function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    //generates password for the new admin
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    var hashedpassword = await bcrypt.hash(password, 12);
    var ress= await adminmodel.insertnewSystemAdmin(name, email, hashedpassword)
    var emailtext = "A new Account was created for you as a System admin \n your usename is:"
        + name + "\n your password is: " + password + "\n You can change the password anytime from your account \n"
    sendemail.sendToNewAdmin(email, "Easy Elicitation System admin Account", emailtext)
    res.redirect('/newadmin')
}
exports.sendresetpasswordemail = async function (req, res) {

    var result = await adminmodel.getSystemAdminByEmail(req.query.email)
    if (result[0] == null) {
        res.send("user not found")
    } else {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) console.log(err)
            else {
                const token = buffer.toString("hex")
                var email = req.query.email
                var expireToken = Date.now() + 3600000
                var resultt = await adminmodel.forgetpassword(token, expireToken, email)
                var emailsubject = "please reset your password"
                var emailtext = "Please use the following link to reset your password \n"
                    + "http://localhost:8081/resetpassword/" + token + "?email=" + email
                sendemail.sendToNewAdmin(email, emailsubject, emailtext)
                res.send("please check your email to reset password")
            }
        });
    }
}
exports.resetpassword = async function (req, res) {
    var newpassword = req.body.password
    var email = req.body.email
    var token = req.body.token
    var result = await adminmodel.resetpassword(email, token);
    if (result[0] == null) {
        res.send("user not found")
    } else {
        var expireToken = result[0].expireToken;
        if (parseInt(expireToken) >= parseInt(Date.now().toString())) {
            bcrypt.hash(newpassword, 12)
                .then(hashedpassword => {
                    adminmodel.updatePassword(hashedpassword, email)
                    res.redirect('/')
                })
        }
    }
}
exports.deleteSystemAdmin = async function (req, res) {
    var result = await adminmodel.deleteSystemAdmin(req.query.adminid);
    res.redirect('/getalladmins');
};
exports.getAllSystemAdmins = async function (req, res) {
    var result = await adminmodel.getAllSystemAdmins();
    res.render('viewalladmins', {
        result: result
    });
};
exports.editpassword = async function (req, res) {
    var result = await adminmodel.getSystemAdminByEmail(req.session.email)
    if (result[0] == null) {
        res.send("user not found")
    }
    var match = await bcrypt.compare(req.body.oldpassword, result[0].password)
    if (!match) {
        res.send("wrong old password")
    }
    else {
        var hashedpassword = await bcrypt.hash(req.body.newpassword, 12)
        var result = await adminmodel.updatePassword(hashedpassword, req.session.email)
        res.send("ok")
    }

}




