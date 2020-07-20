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
  createPackageUnit: (root, args, ctx) => {
    if (!process.env.BYPASS_AUTH) {
      if (!ctx.user || !ctx.user.isAdmin) return null;
    }

    return prisma.packageUnit.create({
      data: {
        code: args.code,
        packageIsDelivered: args.packageIsDelivered,
      },
    });
  },
  createSecurityAdmin: (root, args, ctx) => {
    
    if (!process.env.BYPASS_AUTH) {
      if (!ctx.user || !ctx.user.isAdmin) return null;
    }

    return prisma.securityAdmin.create({
      data: {
        email: args.email,
        password: args.password,
      },
    });
  },
};

module.exports = {
  resolvers,
};