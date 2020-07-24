/**
 * Original source: https://github.com/prisma/prisma-examples/tree/master/javascript/graphql-apollo-server
 * Author: https://github.com/prisma
 * License: Apache 2.0 - https://github.com/prisma/prisma-examples/blob/master/LICENSE
 */

const { prisma } = require("./generated/prisma-client");
const { decode } = require("./identification");

function createContext({req}) {
  // add the req to the context
  return { prisma, req };
}

module.exports = {
  createContext,
};
