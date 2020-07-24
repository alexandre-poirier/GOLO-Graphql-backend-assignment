/**
 * Source: https://github.com/apollographql/apollo-server/issues/2277#issuecomment-515633359
 * Author: https://github.com/bluwy
 * License: MIT https://github.com/the-vampiire
 */

const { ApolloServer } = require("apollo-server"); // import from your flavor
const { createContext } = require("../context");
const { schema } = require("../schema");

// server config is the object you pass into the ApolloServer constructor
// { resolvers, typeDefs, schemaDirectives, context, ... }

// execute the context function to get the base context object
// optionally you can add a default req or res in this step
const baseContext = createContext({req: {headers: {authorization: ''}}});

// create a test server subclass with the methods built in
class ApolloTestServer extends ApolloServer {
  constructor(config) {
    super(config);
    this.context = baseContext;
  }

  setContext(newContext) {
    this.context = newContext;
  }

  mergeContext(partialContext) {
    this.context = Object.assign({}, this.context, partialContext);
  }

  resetContext() {
    this.context = baseContext;
  }
}

module.exports = {
  baseContext,
  testServer: new ApolloTestServer({
    schema: schema,
  }),
};