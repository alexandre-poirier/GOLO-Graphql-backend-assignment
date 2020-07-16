var express = require('express');
var router = express.Router();
const crypto = require("crypto");
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

/* Create user JWT. */
router.post('/user/login', function (req, res, next) {
  let email = req.body['email'];
  let password = req.body['password'];
  let isAdmin = req.body['isAdmin'];

  let currentPasswordHash = crypto.createHash('aes256')
    .update(password).digest("hex");

  let dbPasswordHash = getDbPasswordHash(isAdmin, email);

  // If currentPasswordHash === dbPasswordHash, we create a jwt and send it back to the client

  res.send('respond with a resource');
});

/* Retrieves the password hash. Will look into security_admin table if isAdmin is true or resident table otherwise */
var getDbPasswordHash = (isAdmin, email, currentPasswordHash) => {

}

module.exports = router;
