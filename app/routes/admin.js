const { router } = require('../config/express')

const { BASE_URL } = require("../config/constants")

const { upload } = require('../config/multer')

const {
  getUsers,
  addAdmin,
  getAdmin,
  getQueries
} = require('../controllers/admin')

router.get(`${BASE_URL}/admin/GET/login/:email/:password`, getUsers)

router.get(`${BASE_URL}/admin/GET/all-users`, getUsers)

router.post(`${BASE_URL}/admin/POST/sub-admin`, addAdmin)

router.get(`${BASE_URL}/admin/GET/sub-admins`, getAdmin)

router.get(`${BASE_URL}/admin/GET/sub-queries`, getQueries)

module.exports = router
