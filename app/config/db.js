const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;

const connectionString =
  "mongodb+srv://hamzay123:mindstorm123@cluster0.9akiq.mongodb.net/test"

const connectionConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(connectionString, connectionConfig);

module.exports = { client, ObjectID }