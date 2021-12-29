const {
    client,
    ObjectID
} = require('../config/db')

// Auth

const userLogin = (req, res) => {

    const { email, password } = req.params;

    client.db("mind-storm").collection("users").findOne({ email }, function (err, result) {
        if (err) {
            res.json({
                success: false,
                info: err,
                message: 'Something went wrong'
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
                    message: 'Logged in successful',
                    info: result,
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

const register = (req, res) => {

    const info = req.body;

    client.db("mind-storm").collection("users").findOne(
        { email: info.email },
        function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Something went wrong',
                    info: error
                })
            }
            else if (result) {
                res.json({
                    success: false,
                    message: 'Email is already in use with an account'
                })
            }
            else if (!result) {
                client.db("mind-storm").collection("users").insertOne(
                    info,
                    (error, result) => {
                        if (!error) {
                            res.json({
                                success: true,
                                message: "Account has been registered Succusfully",
                                info
                            });
                        } else {
                            res.json({
                                success: false,
                                message: "Something went wrong",
                                info: error,
                            });
                        }
                    }
                );
            }
        }
    );

    return res;
}

// Work space cruds

const createWorkSpace = (req, res) => {

    const body = req.body;

    const { userId } = req.params;

    body.userId = userId;

    body.participants = [];

    body.noOfParticipants = 0;

    body.noOfSessions = 0;

    console.log(body)

    client.db("mind-storm").collection("work-spaces").insertOne(
        body,
        (err, result) => {
            if (!err) {
                res.json({
                    success: true,
                    message: "Work Space created successfully",
                });
            } else {
                res.json({
                    success: false,
                    message: 'Someting went wrong',
                    info: err,
                });
            }
        }
    );

    return res;
}

const getYourWorkSpaces = (req, res) => {

    const { userId } = req.params

    client.db("mind-storm").collection("work-spaces")
        .find({ userId })
        .toArray((err, result) => {
            if (result) {
                res.json({
                    success: true,
                    info: result,
                });
            }
            if (err) {
                res.json({
                    success: false,
                    message: 'Something went wrong',
                    error: error,
                });
            }
            if (!result) {
                res.json({
                    success: true,
                    message: "Ops, you have not created any work space yet..",
                });
            }
        });

    return true

}

const joinWorkSpace = async (req, res) => {

    const { _id, userEmail } = req.body

    console.log(_id)

    const workSpace = await client
        .db("mind-storm")
        .collection("work-spaces")
        .findOne({ _id: ObjectID(_id) });

    if (workSpace) {

        const participants = workSpace.participants ? workSpace.participants : []

        if (userEmail && !participants.includes(userEmail)) {
            participants.push(userEmail)
            const body = {
                participants,
                noOfParticipants: participants.length
            }

            client.db("mind-storm").collection("work-spaces")
                .findOneAndUpdate({ _id: ObjectID(_id) },
                    { $set: body }, (err, result) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: "Something went wrong",
                                error: err
                            })
                        }
                        else if (!err) {
                            res.json({
                                success: true,
                                message: `You have joined ${workSpace.name}`
                            })
                        }
                    });

        }
        else {
            res.json({
                success: false,
                message: `You are alrady a part of ${workSpace.name}`
            })
        }


    }

    return res;
}

const getJoinedWorkSpaces = (req, res) => {

    const { email } = req.params

    console.log(email)

    client.db("mind-storm").collection("work-spaces")
        .find({})
        .toArray((err, result) => {
            if (!err) {

                let workSpaces = []

                // console.log(result)

                result.forEach((item) => {
                    let cat = typeof (item.participants) === 'string' ? item.participants.split(",") : item.participants
                    if (cat?.includes(email)) {
                        workSpaces.push(item)
                    }
                })

                if (workSpaces?.length) {
                    res.json({
                        success: true,
                        info: workSpaces,
                    });
                }
                else {
                    res.json({
                        success: true,
                        message: "you not joined any workspace yet.",
                        workSpacess: [],
                    });
                }
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
                    message: "workSpacess not joined any workspace yet.",
                    workSpacess: [],
                });
            }
        });

    return true

}


// session cruds

const createSessions = (req, res) => {

    const info = req.body;

    const { workSpaceId } = req.params;

    info.workSpaceId = workSpaceId;

    client.db("mind-storm").collection("session").insertOne(
        (err, result) => {
            if (!err) {
                client.db("mind-storm").collection("work-spaces").insertOne(
                    info,
                    (err, result) => {
                        if (!err) {
                            res.json({
                                success: true,
                                message: "Session created successfully now you are brain writing",
                            });
                        } else {
                            res.json({
                                success: false,
                                message: 'Someting went wrong',
                                info: err,
                            });
                        }
                    }
                );
            } else {
                res.json({
                    success: false,
                    message: err,
                });
            }
        }
    );

    return res;
}

module.exports = {
    userLogin,
    register,
    createWorkSpace,
    getYourWorkSpaces,
    joinWorkSpace,
    getJoinedWorkSpaces,
    createSessions,
}