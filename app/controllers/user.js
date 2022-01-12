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

    let file;

    if (req.file) {
        const { originalname, mimetype } = req.file;
        file =
            `public/uploads/${originalname}`;
    }

    info.file = file;

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

// profile

const updateProfile = (req, res) => {


    const { _id } = req.body;
    
    const body = req.body;

    delete body._id

    client.db("mind-storm").collection("users")
        .findOneAndUpdate({ _id: ObjectID(_id) },
            { $set: body }, async(err, result) => {
                if (err) {
                    res.json({
                        success: false,
                        message: "Something went wrong",
                        error: err
                    })
                }
                else if (!err) {
                  
                    const user = await client
                    .db("mind-storm")
                    .collection("users")
                    .findOne({ _id: ObjectID(_id) });

                    res.json({
                        success: true,
                        message: 'Profile editied successfully',
                        info: user
                    })
                }
            });


}

const updateProfilePicture = (req, res) => {


    const { _id } = req.body;
    
    let file;

    if (req.file) {
        const { originalname, mimetype } = req.file;
        file =
            `public/uploads/${originalname}`;
    }
    

    client.db("mind-storm").collection("users")
        .findOneAndUpdate({ _id: ObjectID(_id) },
            { $set: { file } }, async(err, result) => {
                if (err) {
                    res.json({
                        success: false,
                        message: "Something went wrong",
                        error: err
                    })
                }
                else if (!err) {
                  
                    const user = await client
                    .db("mind-storm")
                    .collection("users")
                    .findOne({ _id: ObjectID(_id) });

                    res.json({
                        success: true,
                        message: 'Profile editied successfully',
                        info: user
                    })
                }
            });


}

// Work space cruds

const createWorkSpace = (req, res) => {

    let file;

    if (req.file) {
        const { originalname, mimetype } = req.file;
        file =
            `public/uploads/${originalname}`;
    }

    const body = req.body;

    const { userId } = req.params;

    body.userId = userId;

    body.file = file;

    body.participants = [];

    body.noOfParticipants = 0;

    body.noOfSessions = 0;

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

    const { _id, userEmail, userName, file } = req.body

    const participant = {
        workSpaceId: _id,
        userEmail,
        userName,
        file
    }

    const workSpace = await client
        .db("mind-storm")
        .collection("work-spaces")
        .findOne({ _id: ObjectID(_id) });

    if (workSpace) {

        const participants = workSpace.participants ? workSpace.participants : []

        if (!participants.includes(userEmail)) {
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
                            client.db("mind-storm").collection("participants").insertOne(
                                participant,
                                (err, result) => {
                                    if (!err) {
                                        res.json({
                                            success: true,
                                            message: `You have joined ${workSpace.name}`
                                        })
                                    } else {
                                        res.json({
                                            success: false,
                                            message: 'Someting went wrong',
                                            info: err,
                                        });
                                    }
                                }
                            );
                        }
                    });

        }
        else {
            res.json({
                success: false,
                message: `You are already a part of ${workSpace.name}`
            })
        }

    }

    return res;
}

const getJoinedWorkSpaces = (req, res) => {

    const { email } = req.params

    client.db("mind-storm").collection("work-spaces")
        .find({})
        .toArray((err, result) => {
            if (!err) {

                let workSpaces = []

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
                        message: "you have not joined any workspace yet.",
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

const deleteWorkSpace = (req, res) => {

    const { _id } = req.body;

    client.db("mind-storm").collection("work-spaces").findOneAndDelete(
        { _id: ObjectID(_id) },
        (err, result) => {
            if (!err) {
                res.json({
                    success: true,
                    message: "Workspace deleted successfully",
                });
            } else {
                res.json({
                    success: false,
                    message: 'Something went wrong',
                    error: err
                });
            }
        }
    )
}

const leaveWorkSpace = async (req, res) => {

    const { _id, workSpaceId, userEmail, participantId, participantEmail } = req.body;
    let { participants } = req.body;

    participants = participants.filter((user) => String(user) !== String(participantEmail))

    const body = {
        participants,
        noOfParticipants: participants.length
    }

    console.log(participantId)

    client.db("mind-storm").collection("participants").findOneAndDelete(
        { userEmail: String(participantEmail) },
        (err, result) => {
            if (!err) {
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
                                    message: "Work Space left successfully",
                                });
                            }
                        });
            } else {
                res.json({
                    success: false,
                    message: 'Something went wrong',
                    error: err
                });
            }
        }
    )


    return true

}

// session cruds

const createSessions = async (req, res) => {

    const { workSpaceId } = req.body;
    const info = req.body;
    info.status = "active"

    const workSpace = await client
        .db("mind-storm")
        .collection("work-spaces")
        .findOne({ _id: ObjectID(workSpaceId) });

    client.db("mind-storm").collection("session").insertOne(
        info,
        (err, result) => {
            if (!err) {
                client.db("mind-storm").collection("work-spaces")
                    .findOneAndUpdate({ _id: ObjectID(workSpaceId) },
                        { $set: { noOfSessions: Number(workSpace.noOfSessions + 1) } }, (error, result) => {
                            if (error) {
                                res.json({
                                    success: false,
                                    message: "Something went wrong",
                                    error: error
                                })
                            }
                            else if (!error) {
                                res.json({
                                    success: true,
                                    message: "Session as been created you are brain writing",
                                })
                            }
                        });

            } else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                    error: err
                });
            }
        }
    );

    return res;
}

const getSessions = (req, res) => {

    const { workSpaceId } = req.params

    client.db("mind-storm").collection("session")
        .find({ workSpaceId })
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
                    message: "Ops, you have not created any sessions yet..",
                });
            }
        });

    return true

}

const endSession = (req, res) => {

    const { _id } = req.params

    client.db("mind-storm").collection("session")
        .findOneAndUpdate({ _id: ObjectID(_id) },
            { $set: { status: 'closed' } }, (err, result) => {
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
                        message: "Session has been closed",
                    })
                }
            });

    return true

}

// participants

const addParticipant =  async (req, res) => {

    const { email } = req.params
    
    const workSpace  = req.body

    const user = await client
        .db("mind-storm")
        .collection("users")
        .findOne({ email });

    if (user) {

        const participant = {
            workSpaceId: workSpace._id,
            userEmail: user.email,
            userName: user.name,
            file: user.file
        }
        
        const participants = workSpace.participants ? workSpace.participants : []

        if (!participants.includes(email)) {
            participants.push(email)
          
            const body = {
                participants,
                noOfParticipants: participants.length
            }

            console.log(body, 'body')
            console.log(participants, 'participants')
            console.log(participant, 'participant')

            client.db("mind-storm").collection("work-spaces")
                .findOneAndUpdate({ _id: ObjectID(workSpace._id) },
                    { $set: body }, (err, result) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: "Something went wrong",
                                error: err
                            })
                        }
                        else if (!err) {
                            client.db("mind-storm").collection("participants").insertOne(
                                participant,
                                (err, result) => {
                                    if (!err) {
                                        res.json({
                                            success: true,
                                            message: `${email} has been added to ${workSpace.name}`
                                        })
                                    } else {
                                        res.json({
                                            success: false,
                                            message: 'Someting went wrong',
                                            info: err,
                                        });
                                    }
                                }
                            );
                        }
                    });

        }
        else {
            res.json({
                success: false,
                message: `${email} is already a part of ${workSpace.name}`
            })
        }

    }
    else{
        res.json({
            success: false,
            message: `User does not exist`
        })
    }

    return res;
}

const getParticipants = (req, res) => {

    const { workSpaceId } = req.params

    client.db("mind-storm").collection("participants")
        .find({ workSpaceId })
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
                    message: "Ops, you have not created any sessions yet..",
                });
            }
        });

    return true

}

const deleteParticipant = async (req, res) => {

    const { _id, workSpaceId, userEmail } = req.body;


    const workSpace = await client
        .db("mind-storm")
        .collection("work-spaces")
        .findOne({ _id: ObjectID(workSpaceId) });

    let participants = workSpace.participants

    participants = participants.filter((user) => String(user) !== String(userEmail))

    const body = {
        participants,
        noOfParticipants: participants.length
    }

    client.db("mind-storm").collection("participants").findOneAndDelete(
        { _id: ObjectID(_id) },
        (err, result) => {
            if (!err) {
                client.db("mind-storm").collection("work-spaces")
                    .findOneAndUpdate({ _id: ObjectID(workSpaceId) },
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
                                    message: "Participants deleted successfully",
                                });
                            }
                        });
            } else {
                res.json({
                    success: false,
                    message: 'Something went wrong',
                    error: err
                });
            }
        }
    )


    return true

}

// notes

const createNotes = (req, res) => {

    const info = req.body;

    client.db("mind-storm").collection("notes").insertOne(
        info,
        (err, result) => {
            if (!err) {
                res.json({
                    success: true,
                    message: "Idea posted successfully",
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

const getNotes = (req, res) => {

    const { sessionId } = req.params

    client.db("mind-storm").collection("notes")
        .find({ sessionId })
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
                    message: "Ops, you no one as posted any idea yet..",
                });
            }
        });

    return true

}

const deleteNotes = (req, res) => {

    const { _id } = req.body;

    client.db("mind-storm").collection("notes").findOneAndDelete(
        { _id: ObjectID(_id) },
        (err, result) => {
            if (!err) {
                res.json({
                    success: true,
                    message: "Idea successfully",
                });
            } else {
                res.json({
                    success: false,
                    message: 'Something went wrong',
                    error: err
                });
            }
        }
    )
}

// answers

const createAnswer = (req, res) => {

    const info = req.body;

    client.db("mind-storm").collection("answers").insertOne(
        info,
        (err, result) => {
            if (!err) {
                res.json({
                    success: true,
                    message: "Answer posted successfully",
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

const getAnswers = (req, res) => {

    const { sessionId } = req.params

    client.db("mind-storm").collection("answers")
        .find({ sessionId })
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
                    message: "Ops, you no one as posted any idea yet..",
                });
            }
        });

    return true

}

// queries

const sendQueries = (req, res) => {

    const body = req.body;

    client.db("mind-storm").collection("queries").insertOne(
        body,
        (err, result) => {
            if (!err) {
                res.json({
                    success: true,
                    message: "Your query has been sent successfully",
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


module.exports = {
    userLogin,
    register,
    createWorkSpace,
    getYourWorkSpaces,
    joinWorkSpace,
    getJoinedWorkSpaces,
    deleteWorkSpace,
    leaveWorkSpace,
    createSessions,
    getSessions,
    getParticipants,
    deleteParticipant,
    createNotes,
    getNotes,
    createAnswer,
    getAnswers,
    endSession,
    sendQueries,
    updateProfile,
    updateProfilePicture,
    addParticipant,
    deleteNotes
}