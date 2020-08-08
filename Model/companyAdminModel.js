var db = require('../databaseconnection');
const util = require('util');
const query = util.promisify(db.query).bind(db);

module.exports = {
    getAllCompanyAdmins: async function () {
        let sql = "SELECT * FROM companyadmin"
        sql = db.format(sql);
        const output = await query(sql);
        return output;

    },
    checkemailexistance: async function (email) {
        let sql = "SELECT * FROM companyadmin WHERE email = ? ";
        let inserts = [email]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;

    },
    insertnewCompanyAdmin: async function (name, email, hashedpassword,companyname) {
        let sql = "INSERT INTO companyadmin (name,companyName,email,password) VALUES (?,?,?,?)";
        let inserts = [name,companyname,email,hashedpassword]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;
    },
    deleteCompanyAdmin: async function (id) {
        let sql = "DELETE FROM companyadmin where companyAdminId = ? ";
        let inserts = [id]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;
    },
}