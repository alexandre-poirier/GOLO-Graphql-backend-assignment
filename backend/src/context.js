/**
 * Original source: https://github.com/prisma/prisma-examples/tree/master/javascript/graphql-apollo-server
 * Author: https://github.com/prisma
 * License: Apache 2.0 - https://github.com/prisma/prisma-examples/blob/master/LICENSE
 */

const { prisma } = require("./generated/prisma-client");

function createContext() {
    return { prisma };
}

module.exports = {
  createContext,
};
