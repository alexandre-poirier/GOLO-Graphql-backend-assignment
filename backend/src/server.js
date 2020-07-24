/**
 * Original source1: https://github.com/prisma/prisma-examples/tree/master/javascript/graphql-apollo-server
 * Author: https://github.com/prisma
 * License: Apache 2.0 - https://github.com/prisma/prisma-examples/blob/master/LICENSE
 *
 */
// Adds secrets from your root .env file. Don't forget to define JWT_SECRET
require("dotenv").config({ path: "./.env" });
const { ApolloServer } = require("apollo-server");
const { schema } = require("./schema");
const { createContext } = require("./context");

const port = process.env.PORT || 8080;

new ApolloServer({
  schema,
  context: createContext,
}).listen({ port: port }, () => {
  console.log(`Server ready at: http://localhost:${port}`);
});
