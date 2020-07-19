/**
 * Original source1: https://github.com/prisma/prisma-examples/tree/master/javascript/graphql-apollo-server
 * Author: https://github.com/prisma
 * License: Apache 2.0 - https://github.com/prisma/prisma-examples/blob/master/LICENSE
 *
 */
// Adds secrets from your root .env file. Don't forget to define JWT_SECRET
require('dotenv').config({ path: './.env' });
const { ApolloServer } = require("apollo-server");
const { schema } = require("./schema");
const { serverContext } = require("./serverContext");

new ApolloServer({
  schema,
  context: serverContext,
}).listen({ port: 4000 }, () =>
  console.log(`Server ready at: http://localhost:4000`)
);
