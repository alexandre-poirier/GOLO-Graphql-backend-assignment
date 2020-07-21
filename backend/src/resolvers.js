const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const identificationService = require("./identification");

let resolvers = {
  createBuilding: (root, args, ctx) => {
    if (!validateAuthorization(ctx, true)) return null;

    return prisma.building.create({
      data: {
        address: args.address,
      },
    });
  },
  createPackageUnit: (root, args, ctx) => {
    if (!validateAuthorization(ctx, true)) return null;

    return prisma.packageUnit.create({
      data: {
        code: args.code,
        packageIsDelivered: args.packageIsDelivered,
      },
    });
  },
  createSecurityAdmin: (root, args, ctx) => {
    // For addiitonal security, we could make it so that only admins can create admins in a real prod environment. The first administrator would be entered manually in the database.
    // if(!validateAuthorization(ctx, true))
    //   return null;

    return prisma.securityAdmin.create({
      data: {
        email: args.email,
        password: identificationService.createPasswordHash(args.password),
      },
    });
  },
  createResident: (root, args, ctx) => {
    if (!validateAuthorization(ctx, true)) return null;

    return prisma.resident.create({
      data: {
        email: args.email,
        password: identificationService.createPasswordHash(args.password),
        address: args.address,
        emailNotificationSent: args.emailNotificationSent,
        isEmailNotification: args.isEmailNotification,
        isSmsNotification: args.isSmsNotification,
        name: args.name,
        phoneNumber: args.phoneNumber,
        smsNotificationSent: args.smsNotificationSent,
        unitNumber: args.unitNumber,
      },
    });
  },
  login: async (root, args, ctx) => {
    let hashedPassword = identificationService.createPasswordHash(
      args.password
    );
    var token = "";
    if (args.isAdmin) {
      await prisma.securityAdmin
        .findOne({
          where: {
            email: args.email,
          },
          select: {
            email: true,
            id: true,
            password: true,
          },
        })
        .then((securityAdmin) => {
          if (
            securityAdmin !== null &&
            securityAdmin.password === hashedPassword
          )
            token = identificationService.sign(
              securityAdmin.id,
              securityAdmin.email,
              false
            );
        })
        .catch((err) => {});
    } else {
      await prisma.resident
        .findOne({
          where: {
            email: args.email,
          },
          select: {
            email: true,
            id: true,
            password: true,
          },
        })
        .then((resident) => {
          if (resident !== null && resident.password === hashedPassword)
            token = identificationService.sign(
              resident.id,
              resident.email,
              false
            );
        })
        .catch((err) => {});
    }
    return token;
  },
};

let validateAuthorization = (context, shouldBeAdmin) => {
  let authorized = false;
  if (!process.env.BYPASS_AUTH) {
    if (context && context.user) {
      if (shouldBeAdmin) {
        if (context.user.isAdmin) {
          authorized = true;
        }
      } else {
        authorized = true;
      }
    }
  } else {
    authorized = true;
  }

  return authorized;
};

module.exports = {
  resolvers,
  validateAuthorization,
};
