const { BASE_URL } = require('../config/constants')

const { router } = require('../config/express')

const { client } = require('../config/db')

const { 
    workerLogin,
    getAllCategories
} = require('../controllers/worker')

router.get(`${BASE_URL}/user/GET/login/:email/:password`, workerLogin);

router.get(`${BASE_URL}/user/GET/category`, getAllCategories);

router.get(`${BASE_URL}/user/GET/search/:name`, (req, res) => {

    const { name } = req.params

    const nameRegex = new RegExp(name, 'i')

    client.db("Alma").collection("products")
        .find({ name: nameRegex })
        .toArray((err, result) => {
            if (result) {
                res.json({
                    success: true,
                    results: result,
                });
            }
            if (err) {
                res.json({
                    success: false,
                    results: err,
                });
            }
            if (!result) {
                res.json({
                    success: true,
                    results: [],
                });
            }
        });

    return res;
});

module.exports = router