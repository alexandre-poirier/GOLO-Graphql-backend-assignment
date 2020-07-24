const validateAuthorization = require("./resolvers").validateAuthorization;
const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe("Tests validateAuthorization functionality", () => {
  test("authorizing a non admin with a user in the context for case where it should be an admin", (done) => {
    process.env.BYPASS_AUTH = false;

    // auth payload:
    // {
    //   "id": 1,
    //   "email": "test@example.com",
    //   "isAdmin": false
    // }

    let context = {
      req: {
        headers: {
          authorization:
            "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaXNBZG1pbiI6ZmFsc2V9.-g6nPAL5aNi1po2D9eP7ADm0Egv8p5eQN0i6p4depNAXsf49BA7BI1nGFTPhnDgauaWW3zpqpeAFuk0osRE6og",
        },
      },
    };

    expect(validateAuthorization(context, true)).toEqual(false);
    done();
  });
  test("authorizing an admin with a user in the context for case where it should be an admin", (done) => {
    process.env.BYPASS_AUTH = false;
    // auth payload:
    // {
    //   "id": 1,
    //   "email": "test@example.com",
    //   "isAdmin": true
    // }

    let context = {
      req: {
        headers: {
          authorization:
            "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaXNBZG1pbiI6dHJ1ZX0.aYrcvQd0FFpzwgtWE1mt9NzIWh7Ng4PxhJo7gZjE37Bp41lT30ZwL77fAm-xMbWcTNIl8LtkFtXJhRcPPb1OuQ",
        },
      },
    };

    expect(validateAuthorization(context, true)).toEqual(true);
    done();
  });
  test("authorizing an undefined user", (done) => {
    process.env.BYPASS_AUTH = false;
    let context = {};

    expect(validateAuthorization(context, true)).toEqual(false);
    done();
  });
  test("authorizing an undefined authorization", (done) => {
    process.env.BYPASS_AUTH = false;
    let context = { req: { headers: {} } };

    expect(validateAuthorization(context, true)).toEqual(false);
    done();
  });
});
