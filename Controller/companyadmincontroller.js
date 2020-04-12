var admincontroller = require('../Model/admincontroller');

exports.login = function (req, res) {
    var query="INSERT INTO company (username,email,password,telephone_number,CV) VALUES ('"+username+"','"+email+"','"+password+"','"+telephonenumber+"','"+CV+"')";
    adminmodel.login(req, res, email, password, loggedin);

}

loggedin = function (req, res, checkstate) {
    

    if (checkstate) {
        res.send("LOGGED IN SUCC" + req.query.email + " " + req.query.password);
    }
    else {
        res.send("ERROR");
    }

}