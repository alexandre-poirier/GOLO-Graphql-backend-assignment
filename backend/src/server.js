/**
 * Original source: https://github.com/prisma/prisma-examples/tree/master/javascript/graphql-apollo-server
 * Author: https://github.com/prisma
 * License: Apache 2.0 - https://github.com/prisma/prisma-examples/blob/master/LICENSE
 */

const { ApolloServer } = require('apollo-server');
const { schema } = require('./schema');
const { prisma } = require('./generated/prisma-client');


new ApolloServer({ schema, context: {prisma} }).listen(
  { port: 4000 },
  () =>
    console.log(
      `Server ready at: http://localhost:4000`,
    ),
)
