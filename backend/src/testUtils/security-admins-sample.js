const { nanoid } = require("nanoid");

let securityAdmins = [];

let getSecurityAdmin = () => {
  let securityAdmin = {email: `${nanoid(15)}@example.com`, password: "1234"};
  securityAdmins.push(securityAdmin);
  return securityAdmin;
}

let getStaticSecurityAdmin = () => {
  let securityAdmin = {email: `test363643@example.com`, password: "1234"};
  securityAdmins.push(securityAdmin);
  return securityAdmin;
}

module.exports = {
  securityAdmins,
  getSecurityAdmin,
  getStaticSecurityAdmin,
};
