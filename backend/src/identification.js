/**
 * Original source 2 (jwt code snippets): https://github.com/apollographql/apollo-server/blob/main/docs/source/security/authentication.md
 * Author: https://github.com/apollographql
 * License: MIT - https://github.com/apollographql/apollo-server/blob/main/LICENSE
 */

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sign = (id, email, isAdmin, secret) => {
  return jwt.sign({ id: id, email: email, isAdmin: isAdmin }, secret, {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
    algorithm: "HS512"
  });
};

const decode = (token, secret) => {
  try {
    if (token) {
      return jwt.verify(token, secret, {algorithms: "HS512"});
    }
    return null;
  } catch (err) {
    return null;
  }
};

const validatePasswordHash = (password, passwordHash) => {
  var hash = crypto.createHash("sha512");
  return hash.update(password, "utf8").digest("hex") === passwordHash;
};

const createPasswordHash = (password) => {
  var hash = crypto.createHash("sha512");
  return hash.update(password, "utf8").digest("hex");
};

module.exports = {
  decode,
  sign,
  validatePasswordHash,
  createPasswordHash,
};
