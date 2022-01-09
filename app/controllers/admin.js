const {
  client,
  ObjectId
} = require('../config/db')

// auth

const adminLogin = (req, res) => {

  const { email, password } = req.params;

  client.db("mind-storm").collection("admins").findOne({ email }, function (err, result) {
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

// users 

const getUsers = (req, res) => {

  client.db("mind-storm").collection("users")
    .find({})
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

// admin

const addAdmin = (req, res) => {

  const info = req.body;

  client.db("mind-storm").collection("admins").findOne(
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
        client.db("mind-storm").collection("admins").insertOne(
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

const getAdmin = (req, res) => {

  console.log('getAdmin')

  client.db("mind-storm").collection("admins")
    .find({})
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

// support

const getQueries = (req, res) => {

  client.db("mind-storm").collection("queries")
    .find({})
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

module.exports = {
  getUsers,
  addAdmin,
  getAdmin,
  getQueries,
  adminLogin
}