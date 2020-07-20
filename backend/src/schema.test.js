const { createContext } = require("./context");
const { schema } = require("./schema");
const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const buildinsSample = require("./testUtils/building-sample").buildings;
const packageUnits = require("./testUtils/package-units-sample").packageUnits;
const {securityAdmins, getUniqueEmail} = require("./testUtils/security-admins-sample");
const { nanoid } = require("nanoid");
const server = new ApolloServer({
  context: createContext,
  schema: schema,
  mockEntireSchema: false,
});

const { mutate } = createTestClient(server);


describe("Tests Building functionality", () => {
  test("sends createBuilding request 1", async (done) => {
    
    process.env.BYPASS_AUTH = true;

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

  test("sends createBuilding request and gets blocked by security", async (done) => {
    delete process.env.BYPASS_AUTH;

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
    expect(res.data.createBuilding).toEqual(null);
    done();
  });

  test("sends createBuilding request 2", async (done) => {
    process.env.BYPASS_AUTH = true;
    
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


describe("Tests Package functionality", () => {
  test("sends createPackageUnit request 1", async (done) => {
    process.env.BYPASS_AUTH = true;

    const CREATE_PACKAGE_UNIT = gql`
      mutation CreatePackageUnit($code: String!, $packageIsDelivered: Boolean!) {
        createPackageUnit(code: $code, packageIsDelivered: $packageIsDelivered) {
          packageIsDelivered
          code
        }
      }
    `;
    const res = await mutate({
      mutation: CREATE_PACKAGE_UNIT,
      variables: { code: "111", packageIsDelivered: false },
    });
    expect(res.errors).toBe(undefined);
    expect(res.data.createPackageUnit).toEqual(packageUnits[0]);
    done();
  });

  test("sends createPackageUnit request and gets blocked by security", async (done) => {
    delete process.env.BYPASS_AUTH;

    const CREATE_PACKAGE_UNIT = gql`
      mutation CreatePackageUnit($code: String!, $packageIsDelivered: Boolean!) {
        createPackageUnit(code: $code, packageIsDelivered: $packageIsDelivered) {
          packageIsDelivered
          code
        }
      }
    `;
    const res = await mutate({
      mutation: CREATE_PACKAGE_UNIT,
      variables: { code: "222", packageIsDelivered: false },
    });
    expect(res.errors).toBe(undefined);
    expect(res.data.createPackageUnit).toEqual(null);
    done();
  });
});

describe("Tests Security admin functionality", () => {
  test("sends createSecurityAdmin request 1", async (done) => {
    process.env.BYPASS_AUTH = true;

    const CREATE_SECURITY_ADMIN = gql`
      mutation CreateSecurityAdmin($email: String!, $password: String!) {
        createSecurityAdmin(email: $email, password: $password) {
          email
        }
      }
    `;
    const res = await mutate({
      mutation: CREATE_SECURITY_ADMIN,
      variables: { email: getUniqueEmail(), password: "1234" },
    });
    expect(res.errors).toBe(undefined);
    expect(res.data.createSecurityAdmin).toEqual({email: securityAdmins[0]});
    done();
  });

  test("sends createSecurityAdmin request and gets blocked by security", async (done) => {
    delete process.env.BYPASS_AUTH;

    const CREATE_SECURITY_ADMIN = gql`
      mutation CreateSecurityAdmin($email: String!, $password: String!) {
        createSecurityAdmin(email: $email, password: $password) {
          email
        }
      }
    `;
    const res = await mutate({
      mutation: CREATE_SECURITY_ADMIN,
      variables: { email: getUniqueEmail(), password: "4567" },
    });
    expect(res.errors).toBe(undefined);
    expect(res.data.createSecurityAdmin).toEqual(null);
    done();
  });
});