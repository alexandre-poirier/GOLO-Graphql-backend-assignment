const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let resolvers = {
  createBuilding: (root, args, ctx) => {
    return prisma.building.create({
      data: {
        address: args.address,
      },
    });
  },
};

module.exports = {
    resolvers,
};
  
