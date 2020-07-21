const {
  decode,
  sign,
  createPasswordHash,
  validatePasswordHash,
} = require("./identification");

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe("Tests identification service functionality", () => {
  test("validates password hashes properly", async (done) => {
    let stringNoHash = "test123";
    let sha512Hash =
      "daef4953b9783365cad6615223720506cc46c5167cd16ab500fa597aa08ff964eb24fb19687f34d7665f778fcb6c5358fc0a5b81e1662cf90f73a2671c53f991";
    expect(validatePasswordHash(stringNoHash, sha512Hash)).toBe(true);

    done();
  });

  test("creates password hashes properly", async (done) => {
    let stringNoHash = "test123";
    let sha512Hash =
      "daef4953b9783365cad6615223720506cc46c5167cd16ab500fa597aa08ff964eb24fb19687f34d7665f778fcb6c5358fc0a5b81e1662cf90f73a2671c53f991";
    createPasswordHash(stringNoHash);
    expect(createPasswordHash(stringNoHash) === sha512Hash).toBe(true);
    done();
  });

  test("can sign and decode jwt tokens properly", async (done) => {
    let token = sign(11, "test@example.com", false, "w46tjh4wt6j");
    let decodedToken = decode(token, "w46tjh4wt6j");
    expect(decodedToken.id).toBe(11);
    expect(decodedToken.email).toBe("test@example.com");
    expect(decodedToken.isAdmin).toBe(false);
    done();
  });
});
