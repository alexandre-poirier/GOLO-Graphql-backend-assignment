
const { gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const buildinsSample = require("./testUtils/building-sample").buildings;
const packageUnits = require("./testUtils/package-units-sample").packageUnits;
const identificationService = require("./identification");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {getSecurityAdmin, getStaticSecurityAdmin, securityAdmins } =require("./testUtils/security-admins-sample")
const {
  getUniqueResident,
  residents,
  getStaticResident
} = require("./testUtils/residents-sample");

const { testServer } = require("./testUtils/test-client");
const { query, mutate } = createTestClient(testServer);

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});

afterAll(() => {
  process.env = OLD_ENV;
});

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
});

describe("Tests Package functionality", () => {
  test("sends createPackageUnit request 1", async (done) => {
    process.env.BYPASS_AUTH = true;

    const CREATE_PACKAGE_UNIT = gql`
      mutation CreatePackageUnit(
        $code: String!
        $packageIsDelivered: Boolean!
      ) {
        createPackageUnit(
          code: $code
          packageIsDelivered: $packageIsDelivered
        ) {
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
});

describe("Tests Resident functionality", () => {
  test("creates a resident request 1", async (done) => {
    process.env.BYPASS_AUTH = true;
    
    const CREATE_RESIDENT = gql`
      mutation CreateResident(
        $email: String!
        $password: String!
        $address: String!
        $unitNumber: String!
        $name: String!
        $phoneNumber: String!
        $isSmsNotification: Boolean!
        $isEmailNotification: Boolean!
        $smsNotificationSent: Boolean!
        $emailNotificationSent: Boolean!
      ) {
        createResident(
          email: $email
          password: $password
          address: $address
          unitNumber: $unitNumber
          name: $name
          phoneNumber: $phoneNumber
          isSmsNotification: $isSmsNotification
          isEmailNotification: $isEmailNotification
          smsNotificationSent: $smsNotificationSent
          emailNotificationSent: $emailNotificationSent
        ) {
          email
        }
      }
    `;
    const res = await mutate({
      mutation: CREATE_RESIDENT,
      variables: getUniqueResident(),
    });
    expect(res.errors).toBe(undefined);
    expect(res.data.createResident).toEqual({ email: residents[0].email });
    done();
  });

  test("creates a resident request and uses login", async (done) => {
    process.env.BYPASS_AUTH = true;

    await prisma.resident.deleteMany();

    let staticResident = getStaticResident();

    const CREATE_RESIDENT = gql`
      mutation CreateResident(
        $email: String!
        $password: String!
        $address: String!
        $unitNumber: String!
        $name: String!
        $phoneNumber: String!
        $isSmsNotification: Boolean!
        $isEmailNotification: Boolean!
        $smsNotificationSent: Boolean!
        $emailNotificationSent: Boolean!
      ) {
        createResident(
          email: $email
          password: $password
          address: $address
          unitNumber: $unitNumber
          name: $name
          phoneNumber: $phoneNumber
          isSmsNotification: $isSmsNotification
          isEmailNotification: $isEmailNotification
          smsNotificationSent: $smsNotificationSent
          emailNotificationSent: $emailNotificationSent
        ) {
          email
        }
      }
    `;

    const res = await mutate({
      mutation: CREATE_RESIDENT,
      variables: staticResident,
    });
    expect(res.errors).toBe(undefined);
    expect(res.data.createResident).toEqual({ email: residents[1].email });

    const LOGIN = gql`
      query Login(
        $email: String!
        $password: String!
        $isAdmin: Boolean!
      ) {
        login(
          email: $email
          password: $password
          isAdmin: $isAdmin
        )
      }
    `;

    const res2 = await query({
      query: LOGIN,
      variables: {email: staticResident.email, password: staticResident.password, isAdmin: false}
    });
    expect(res2.errors).toBe(undefined);
    expect(identificationService.decode(res2.data.login).email).toEqual(residents[1].email);

    done();
  });

  test("creates a security admin request, uses login and uses the same admin to create a package", async (done) => {
    process.env.BYPASS_AUTH = false;

    await prisma.securityAdmin.deleteMany();

    let staticSecurityAdmin = getStaticSecurityAdmin();




    const CREATE_SECURITY_ADMIN = gql`
      mutation CreateSecurityAdmin($email: String!, $password: String!) {
        createSecurityAdmin(email: $email, password: $password) {
          email
        }
      }
    `;

    const res = await mutate({
      mutation: CREATE_SECURITY_ADMIN,
      variables: staticSecurityAdmin,
    });
    expect(res.data.createSecurityAdmin).toEqual({
      email: staticSecurityAdmin.email,
    });

    const LOGIN = gql`
      query Login($email: String!, $password: String!, $isAdmin: Boolean!) {
        login(email: $email, password: $password, isAdmin: $isAdmin)
      }
    `;

    const res2 = await query({
      query: LOGIN,
      variables: {
        email: staticSecurityAdmin.email,
        password: staticSecurityAdmin.password,
        isAdmin: true,
      },
    });
    expect(res2.errors).toBe(undefined);
    expect(identificationService.decode(res2.data.login).email).toEqual(
      staticSecurityAdmin.email
    );

    testServer.mergeContext({
      req: { headers: { authorization: res2.data.login } },
    });

    const CREATE_PACKAGE_UNIT = gql`
      mutation CreatePackageUnit(
        $code: String!
        $packageIsDelivered: Boolean!
      ) {
        createPackageUnit(
          code: $code
          packageIsDelivered: $packageIsDelivered
        ) {
          packageIsDelivered
          code
        }
      }
    `;
    const res3 = await mutate({
      mutation: CREATE_PACKAGE_UNIT,
      variables: { code: "1113", packageIsDelivered: false },
    });

    expect(res3.errors).toBe(undefined);
    expect(res3.data.createPackageUnit).toEqual({ code: "1113", packageIsDelivered: false });
    done();
  });
});
