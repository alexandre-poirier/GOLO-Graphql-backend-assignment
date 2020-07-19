const fs = require("fs-extra");

console.log("Ensuring folder exists.");

fs.ensureDirSync("./src/testUtils/test_databases");
fs.ensureDirSync("./prisma/test_databases");

console.log("Cleaning up old databases.");

fs.emptyDirSync("./src/testUtils/test_databases");
fs.emptyDirSync("./prisma/test_databases");