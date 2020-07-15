var express = require('express');
var router = express.Router();
const crypto = require("crypto");

/* Create user JWT. */
router.post('/user/login', function(req, res, next) {
  let userName = req.body['user'];
  let password = req.body['password'];
  let isAdmin = req.body['isAdmin'];



  res.send('respond with a resource');
});

module.exports = router;
