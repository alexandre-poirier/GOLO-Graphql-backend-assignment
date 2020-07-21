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
    let context = {
      user: {
        isAdmin: false,
      },
    };

    expect(validateAuthorization(context, true)).toEqual(false);
    done();
  });
  test("authorizing an admin with a user in the context for case where it should be an admin", (done) => {
    process.env.BYPASS_AUTH = false;
    let context = {
      user: {
        isAdmin: true,
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
  test("authorizing a null user", (done) => {
    process.env.BYPASS_AUTH = false;
    let context = { user: null };

    expect(validateAuthorization(context, true)).toEqual(false);
    done();
  });
});
