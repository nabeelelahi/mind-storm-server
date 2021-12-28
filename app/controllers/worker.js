const {
    client,
    ObjectId
} = require('../config/db')

const workerLogin = (req, res) => {
    
    const { email, password } = req.params;

    client.db("PWIS").collection("users").findOne({ email }, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: err,
            });
        }
        if (!result) {
            res.json({
                success: false,
                message: `Opp, we could'nt find an account corresponding to this email ${email}`,
            });
        } else {
            if (String(result.password) === String(password)) {
                delete result.password;
                res.json({
                    success: true,
                    data: result,
                });
            }
            else {
                res.json({
                    success: false,
                    message: "Opss, Password is incorrect"
                })
            }
        }
    });

    return res;
}

const getAllCategories = (req, res) => {

    client.db("").collection("category")
        .find({})
        .toArray((err, result) => {
            if (result) {
                res.json({
                    success: true,
                    category: result,
                });
            }
            if (err) {
                res.json({
                    success: false,
                    message: err,
                });
            }
            if (!result) {
                res.json({
                    success: true,
                    category: [],
                });
            }
        });

    return res;
}

module.exports = {
    workerLogin,
    getAllCategories
}