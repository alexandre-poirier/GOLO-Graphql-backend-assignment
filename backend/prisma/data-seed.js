const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  let newBuilding1 = await prisma.building.create({
    data: {
      address: "123 special street"
    }
  });
  
  let newBuilding2 = await prisma.building.create({
    data: {
      address: "456 special street"
    }
  });
}

seed()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
  });