const { createContext } = require("./context");
const { schema } = require("./schema");
const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const buildinsSample = require("./testUtils/buildingSample").buildings;
const server = new ApolloServer({
  context: createContext,
  schema: schema,
  mockEntireSchema: false,
});

const { mutate } = createTestClient(server);

describe("Tests Building functionality", () => {
  test("sends createBuilding request 1", async (done) => {

    const CREATE_BUILDING = gql`
      mutation CreateBuilding($address: String!) {
        createBuilding(address: $address) {
          address
        }
      }
    `;

    const res = await mutate({
      mutation: CREATE_BUILDING,
      variables: { address: "123 test street" },
    });
    expect(res.errors).toBe(undefined);
    expect(res.data.createBuilding).toEqual(buildinsSample[0]);
    done();
  });

  test("sends createBuilding request 2", async (done) => {

    const CREATE_BUILDING = gql`
      mutation CreateBuilding($address: String!) {
        createBuilding(address: $address) {
          address
        }
      }
    `;

    const res = await mutate({
      mutation: CREATE_BUILDING,
      variables: { address: "456 test street" },
    });
    expect(res.errors).toBe(undefined);
    expect(res.data.createBuilding).toEqual(buildinsSample[1]);
    done();
  });
});
