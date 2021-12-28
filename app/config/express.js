const express = require('express')
var cors = require('cors')
const { BASE_URL } = require('../config/constants')
const appRoot = `${__dirname
  .replace(/[\\]/gim, '/')
  .replace('/backend/app/config', '/backend')}`
const dirRoot = `${__dirname.replace(/[\\]/gim, '/').replace('/config', '')}`

module.exports = {
  router: express.Router(),

  App: () => {

    const app = express();
    
    const path = require("path");

    const PORT = 7000;

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use(
      `/${BASE_URL}/uploads/`,
      express.static(path.join(__dirname, "uploads"))
    );
    app.use(cors())

    app.listen(
      PORT,
      console.log(`server has started successfully on port : ${PORT}`)
    );

    // endpoint to test if servier is working or not

    app.get(`${BASE_URL}/check`, (req, res) => {

      res.send('fine')
  
      return res;
    });


    return app
  },
}
