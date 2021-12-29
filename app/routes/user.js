const { BASE_URL } = require('../config/constants')

const { router } = require('../config/express')

const { client } = require('../config/db')

const { 
    userLogin,
    register,
    createWorkSpace,
    getYourWorkSpaces,
    joinWorkSpace,
    getJoinedWorkSpaces,
    createSessions,
} = require('../controllers/user')

router.post(`${BASE_URL}/user/POST/register`, register);

router.get(`${BASE_URL}/user/GET/login/:email/:password`, userLogin);

router.post(`${BASE_URL}/user/POST/create-work-space/:userId`, createWorkSpace);

router.get(`${BASE_URL}/user/GET/work-space/:userId`, getYourWorkSpaces);

router.put(`${BASE_URL}/user/PUT/join-workspace`, joinWorkSpace);

router.get(`${BASE_URL}/user/GET/joined-workspace/:email`, getJoinedWorkSpaces);

router.post(`${BASE_URL}/user/POST/create-session/:workSpaceId`, createSessions);


module.exports = router