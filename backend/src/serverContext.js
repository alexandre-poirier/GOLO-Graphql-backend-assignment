/**
 * Original source 2 (jwt code snippets): https://github.com/apollographql/apollo-server/blob/main/docs/source/security/authentication.md
 * Author: https://github.com/apollographql
 * License: MIT - https://github.com/apollographql/apollo-server/blob/main/LICENSE
 */

const { createContext } = require("./context");
const { decode } = require("./identification");
let serverContext = ({ req }) => {
  // Note! This example uses the `req` object to access headers,
  // but the arguments received by `context` vary by integration.
  // This means they will vary for Express, Koa, Lambda, etc.!
  //
  // To find out the correct arguments for a specific integration,
  // see the `context` option in the API reference for `apollo-server`:
  // https://www.apollographql.com/docs/apollo-server/api/apollo-server/

  // Get the user token from the headers.
  const token = req.headers.authorization || "";

  // try to retrieve a user with the token
  const user = decode(token);

  // add the user to the context
  return { user, createContext };
};

module.exports = {
  serverContext,
};
