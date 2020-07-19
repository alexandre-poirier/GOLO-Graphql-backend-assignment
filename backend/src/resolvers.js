const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let resolvers = {
  createBuilding: (root, args, ctx) => {
    if (!process.env.BYPASS_AUTH) {
      if (!ctx.user || !ctx.user.isAdmin) return null;
    }

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
