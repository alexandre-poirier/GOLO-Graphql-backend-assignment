const { nanoid } = require("nanoid");

let residents = [];

let getUniqueResident = () => {
  let resident = {
    email: `${nanoid(15)}@example.com`,
    address: nanoid(10),
    unitNumber: nanoid(4),
    password: "1234",
    name: nanoid(8),
    phoneNumber: nanoid(10),
    isSmsNotification: false,
    isEmailNotification: false,
    smsNotificationSent: false,
    emailNotificationSent: false,
  };
  residents.push(resident);
  return resident;
};

let getStaticResident = () => {
  let resident = {
    email: `test35356@example.com`,
    address: "111 florence street",
    unitNumber: "1111",
    password: "1234",
    name: "John",
    phoneNumber: "555-555-5555",
    isSmsNotification: false,
    isEmailNotification: false,
    smsNotificationSent: false,
    emailNotificationSent: false,
  };
  residents.push(resident);
  return resident;
};

module.exports = {
  residents,
  getUniqueResident,
  getStaticResident,
};
