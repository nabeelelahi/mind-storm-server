const {
  client,
  ObjectId
} = require('../config/db')

const adminLogin = (req, res) => {
  const { email, password } = req.params;

  collections.admin.findOne({ email }, function (err, result) {
    if (err) {
      res.json({
        success: false,
        message: err,
      });
    }
    if (!result) {
      res.json({
        success: false,
        message: "No existing user connected with this Email",
      });
    } else {
      if (String(result.password) === String(password)) {
        res.json({
          success: true,
          info: result,
        });
      }
      else {
        res.json({
          success: false,
          message: "password is incorrect"
        })
      }
    }
  });

  return res;
}

const getAllWorkers = (req, res) => {

  client.db("PWIS").collection("users")
    .find({})
    .toArray((err, result) => {
      if (result) {
        res.json({
          success: true,
          data: result,
        });
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
          message: "Ops, no users have been registered yet..",
        });
      }
    });

  return true

}

const registerWorkers = (req, res) => {

  const info = req.body

  client.db("PWIS").collection("users").findOne(
      { email: info.email },
      function (err, result) {
          if (err) {
              res.json({
                  success: false,
                  message: err,
              });
          }
          if (!result) {
              client.db("PWIS").collection("users").insertOne(
                  info,
                  (error, result) => {
                      if (!error) {
                          res.json({
                              success: true,
                              message: "Account has been registered Succusfully",
                              info: info
                          });
                      } else {
                          res.json({
                              success: false,
                              message: error,
                          });
                      }
                  }
              );
          }
          else {
              res.json({
                  success: false,
                  message: "Ooops, there is already an account corresponding to this email.",
              });
          }
      }
  );

  return res;
}

module.exports = {
  adminLogin,
  getAllWorkers,
  registerWorkers
}