const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;

const connectionString =
  "mongodb+srv://Farooq:Farooq123@cluster0.zxjmy.mongodb.net/test"

const connectionConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(connectionString, connectionConfig);

module.exports = { client, ObjectID }