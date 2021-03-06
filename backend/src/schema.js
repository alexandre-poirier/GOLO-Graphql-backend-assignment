/**
 * Original source: https://github.com/prisma/prisma-examples/tree/master/javascript/graphql-apollo-server
 * Author: https://github.com/prisma
 * License: Apache 2.0 - https://github.com/prisma/prisma-examples/blob/master/LICENSE
 */

const {
  idArg,
  makeSchema,
  objectType,
  stringArg,
  booleanArg,
} = require("@nexus/schema");
const { use } = require("nexus");
const prismaPlugin = require("nexus-plugin-prisma").prisma;
const path = require("path");
const { resolvers } = require("./resolvers");
const { makeExecutableSchema } = require("apollo-server");

use(prismaPlugin());

// The following types were generated using https://nexus.js.org/converter.
// The resolvers were implemented using the generated client library from schema.prisma
const Building = objectType({
  name: "Building",
  definition(t) {
    t.id("id");
    t.string("address");
    t.field("packageUnit", {
      type: PackageUnit,
      list: [false],
    });
    t.field("resident", {
      type: Resident,
      list: [false],
    });
  },
});
const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("createResident", {
      type: Resident,
      nullable: true,
      args: {
        address: stringArg({ required: true }),
        unitNumber: stringArg({ required: true }),
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
        name: stringArg({ required: true }),
        phoneNumber: stringArg({ required: true }),
        isSmsNotification: booleanArg({ required: true }),
        isEmailNotification: booleanArg({ required: true }),
        smsNotificationSent: booleanArg({ required: true }),
        emailNotificationSent: booleanArg({ required: true }),
      },
      resolve: resolvers.createResident
    });
    t.field("createPackageUnit", {
      type: PackageUnit,
      nullable: true,
      args: {
        code: stringArg({ required: true }),
        packageIsDelivered: booleanArg({ required: true }),
      },
      resolve: resolvers.createPackageUnit,
    });
    t.field("createBuilding", {
      type: Building,
      nullable: true,
      args: {
        address: stringArg({ required: true }),
      },
      resolve: resolvers.createBuilding,
    });
    t.field("createSecurityAdmin", {
      type: SecurityAdmin,
      nullable: true,
      args: {
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
      },
      resolve: resolvers.createSecurityAdmin,
    });
    t.field("addPackagesToResident", {
      type: Resident,
      nullable: true,
      args: {
        idResident: idArg({ required: true }),
        idPackages: idArg({
          list: true,
          required: true,
        }),
      },
      resolve: resolvers.addPackagesToResident,
    });
    t.field("addPackagesToBuilding", {
      type: Building,
      nullable: true,
      args: {
        idBuilding: idArg({ required: true }),
        idPackages: idArg({
          list: true,
          required: true,
        }),
      },
      resolve: resolvers.addPackagesToBuilding,
    });
    t.field("addResidentsToBuilding", {
      type: Building,
      nullable: true,
      args: {
        idResidents: idArg({
          list: true,
          required: true,
        }),
        idBuilding: idArg({ required: true }),
      },
      resolve: resolvers.addResidentsToBuilding,
    });
  },
});
const PackageUnit = objectType({
  name: "PackageUnit",
  definition(t) {
    t.id("id");
    t.string("code");
    t.boolean("packageIsDelivered");
    t.field("resident", {
      type: Resident,
      nullable: true,
    });
    t.field("building", {
      type: Building,
      nullable: true,
    });
  },
});
const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("allPackagesForBuilding", {
      type: PackageUnit,
      list: [false],
      nullable: true,
      args: {
        idBuilding: idArg({ required: true }),
      },
      resolve: resolvers.allPackagesForBuilding,
    });
    t.field("allPackagesForResident", {
      type: PackageUnit,
      list: [false],
      nullable: true,
      args: {
        idResident: idArg({ required: true }),
      },
      resolve: resolvers.allPackagesForResident,
    });
    t.field("getResidentByEmail", {
      type: Resident,
      nullable: true,
      args: {
        email: stringArg({ required: true }),
      },
      resolve: resolvers.getResidentByEmail,
    });
    t.field("getSecurityAdminByEmail", {
      type: SecurityAdmin,
      nullable: true,
      args: {
        email: stringArg({ required: true }),
      },
      resolve: resolvers.getSecurityAdminByEmail,
    });
    t.string("login", {
      nullable: true,
      args: {
        email: stringArg({ required: true }),
        isAdmin: booleanArg({ required: true }),
        password: stringArg({ required: true }),
      },
      resolve: resolvers.login
    });
  },
});
const Resident = objectType({
  name: "Resident",
  definition(t) {
    t.id("id");
    t.string("address");
    t.string("unitNumber");
    t.string("email");
    t.string("password");
    t.string("name");
    t.string("phoneNumber");
    t.field("packageUnit", {
      type: PackageUnit,
      list: [false],
    });
    t.field("building", {
      type: Building,
      nullable: true,
    });
    t.boolean("isSmsNotification");
    t.boolean("isEmailNotification");
    t.boolean("smsNotificationSent");
    t.boolean("emailNotificationSent");
  },
});
const SecurityAdmin = objectType({
  name: "SecurityAdmin",
  definition(t) {
    t.id("id");
    t.string("email");
    t.string("password");
  },
});
const Subscription = objectType({
  name: "Subscription",
  definition(t) {
    t.field("packageUnitDelivered", {
      type: PackageUnit,
      nullable: true,
      args: {
        id: idArg({ required: true }),
      },
    });
  },
});

const schema = makeSchema({
  types: [Building, Resident, SecurityAdmin, Query, Mutation, Subscription],
  outputs: {
    schema: path.join(__dirname, "./generated/shema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts"),
  },
  typegenAutoConfig: {
    contextType: "types.Context",
    sources: [
      {
        source: path.join(__dirname, "./types.ts"),
        alias: "types",
      },
    ],
  },
});

module.exports = {
  schema,
};
