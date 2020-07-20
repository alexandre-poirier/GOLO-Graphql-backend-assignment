const { nanoid } = require("nanoid");

let securityAdmins = [];

let getUniqueEmail = () => {
  let uniqueEmail = `${nanoid(15)}@example.com`;
  securityAdmins.push(uniqueEmail);
  return uniqueEmail;
}

module.exports = {
  securityAdmins,
  getUniqueEmail,
};
