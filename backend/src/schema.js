/**
 * Original source: https://github.com/prisma/prisma-examples/tree/master/javascript/graphql-apollo-server
 * Author: https://github.com/prisma
 * License: Apache 2.0 - https://github.com/prisma/prisma-examples/blob/master/LICENSE
 */

const { idArg, makeSchema, objectType, stringArg } = require("@nexus/schema");
const { prisma } = require("./generated/prisma-client");
const { use } = require("nexus");
const  prismaPlugin = require("nexus-plugin-prisma").prisma;
const path = require("path");

use(prismaPlugin());

// Do the actual type definitions here using the generated Nexus client library.

const schema = makeSchema({
  types: [], //TODO: Add types here
  outputs: {
    schema: path.join(__dirname, "./generated/shema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts"),
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "./types.js",
        alias: "types"
      }
    ],
  },
});

module.exports = {
  schema,
};
