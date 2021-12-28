const { router } = require('../config/express')

const { BASE_URL } = require("../config/constants")

const { upload } = require('../config/multer')

const {
  adminLogin,
  getAllWorkers,
  registerWorkers
} = require('../controllers/admin')

router.get(`${BASE_URL}/admin/GET/login/:email/:password`, adminLogin);

router.get(`${BASE_URL}/admin/GET/all-users`, getAllWorkers)

router.post(`${BASE_URL}/admin/POST/register-worker`, registerWorkers);

module.exports = router
