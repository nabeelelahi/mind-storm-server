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
    getSessions,
    getParticipants,
    createNotes,
    getNotes,
    createAnswer,
    getAnswers,
    endSession,
    sendQueries,
    deleteParticipant,
    deleteWorkSpace,
    leaveWorkSpace,
    updateProfile,
    updateProfilePicture
} = require('../controllers/user');

const { upload } = require('../config/multer');

router.post(`${BASE_URL}/user/POST/register`, upload.single('file'), register);

router.get(`${BASE_URL}/user/GET/login/:email/:password`, userLogin);

router.post(`${BASE_URL}/user/POST/create-work-space/:userId`, upload.single('file'), createWorkSpace);

router.get(`${BASE_URL}/user/GET/work-space/:userId`, getYourWorkSpaces);

router.put(`${BASE_URL}/user/PUT/join-workspace`, joinWorkSpace);

router.get(`${BASE_URL}/user/GET/joined-workspace/:email`, getJoinedWorkSpaces);

router.post(`${BASE_URL}/user/POST/create-session`, createSessions);

router.get(`${BASE_URL}/user/GET/session/:workSpaceId`, getSessions);

router.patch(`${BASE_URL}/user/PATCH/end-session/:_id`, endSession);

router.get(`${BASE_URL}/user/GET/participants/:workSpaceId`, getParticipants);

router.post(`${BASE_URL}/user/POST/notes`, createNotes);

router.get(`${BASE_URL}/user/GET/notes/:sessionId`, getNotes);

router.post(`${BASE_URL}/user/POST/answers`, createAnswer);

router.get(`${BASE_URL}/user/GET/answers/:sessionId`, getAnswers);

router.post(`${BASE_URL}/user/POST/query`, sendQueries);

router.delete(`${BASE_URL}/user/DELETE/participant`, deleteParticipant);

router.delete(`${BASE_URL}/user/DELETE/workSpace`, deleteWorkSpace);

router.delete(`${BASE_URL}/user/DELETE/leave-workspace`, leaveWorkSpace);

router.put(`${BASE_URL}/user/PUT/update-profile`, updateProfile);

router.put(`${BASE_URL}/user/PUT/update-profile-pic`, upload.single(('file')), updateProfilePicture);


module.exports = router