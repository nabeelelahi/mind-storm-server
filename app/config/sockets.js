function socketConnections() {

    const io = require("socket.io")(9000, {
        cors: {
            origin: 'http://localhost:3000'
        }
    })

    let activeUsers = [{ userId: "", socketId: "" }]

    function addUser(data) {
        !activeUsers.some((user) => user.userId === data.userId) && data.userId !== null ?
            activeUsers.push(data) :
            console.log("not added")
    }

    io.on("connection", (socket) => {

        socket.on("addParticipant", (userId) => {

            const data = { userId, socketId: socket.id }

            addUser(data)

            io.emit("getParticipant", activeUsers)

        })

        socket.on("postNote", ({ senderName, body }) => {
            console.log(body)
            io.emit("getNote", {
                senderName,
                body
            });
        });


        socket.on("sendMessage", ({ senderId,senderName, body }) => {
            console.log(body)
            io.emit("getMessage", {
                senderId,
                senderName,
                body
            });
        });
        
        socket.on("startStarBurstig", (data) => {
            console.log(data)
            io.emit("checkStarBursting", data);
        });

        socket.on("postAnswer", ({ senderName, body }) => {
            console.log(body)
            io.emit("getAnswer", {
                senderName,
                body
            });
        });
        
        socket.on("deleteNote", ({ message }) => {
            io.emit("getDeleteNote", {
                message
            });
        });

        socket.on("disconnect", () => {

            activeUsers = activeUsers.filter((user) => user.socketId === socket.id)

            io.emit("getUsers", activeUsers)

        })
    })

}

module.exports = {
    socketConnections
}