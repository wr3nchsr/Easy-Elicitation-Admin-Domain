var adminmodel = require('../Model/adminmodel');

exports.login = function (req, res) {
    var email = req.query.email;
    var password = req.query.password;
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
