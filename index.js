// express and routing set up

const {
  App,
  router
} = require('./app/config/express')

// setting up web sockets

const { socketConnections } = require('./app/config/sockets')

socketConnections()

// data base set up

const { client, dbConnect } = require('./app/config/db')

const {
  admin,
  worker
} = require('./app/routes')

const main = App()

// checking for connection

if (client.isConnected()) {
  execute();
}
else {
  client.connect().then(function () {
    execute();
  });
}

function execute() {

  main.use(admin).use(worker)

}