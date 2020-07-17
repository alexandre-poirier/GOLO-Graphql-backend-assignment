const { prisma } = require("../src/generated/prisma-client");


//TODO: Build/adjust it using the live server? Or create an sqlite db file + a .sql file?

//To review
let createDataSeed = async () => {
  await prisma.createBuilding({address: "w45h"});
  
};

createDataSeed()
