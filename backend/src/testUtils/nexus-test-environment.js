/**
 * Source: https://github.com/graphql-nexus/nexus/blob/master/website/content/01-getting-started/03-tutorial/07-chapter-6-testing-with-prisma.mdx
 * Author: Nexus (https://github.com/graphql-nexus/)
 * License: MIT (https://github.com/graphql-nexus/nexus/blob/master/LICENSE)
 * It has been modified to use sqlite files instead of postgresql
 */

// tests/nexus-test-environment.js
const sqlite3 = require("sqlite3");
const NodeEnvironment = require("jest-environment-node");
const { nanoid } = require("nanoid");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs-extra");
const path = require("path");

let prismaBinary = "./node_modules/.bin/prisma2";
if (process.platform === "win32") {
  prismaBinary = "node_modules\\.bin\\prisma2";
}

/**
 * Custom test environment for Nexus, Prisma and Postgres
 */
class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    this.db_dir = "test_databases";
    // Generate a unique schema identifier for this test context
    this.db_file = `${this.db_dir}/test__${nanoid()}.db`;
    this.databaseUrl = `file:./${this.db_file}`;

    // Generate the sqlite connection string for the test schema
    this.db = new sqlite3.Database(
      `./src/testUtils/${this.db_file}`,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
    );
  }
  async setup() {
    // Set the required environment variable to contain the connection string
    // to our database test schema
    process.env.DATABASE_URL = this.databaseUrl;
    this.global.process.env.DATABASE_URL = this.databaseUrl;
    this.global.process.env.DB_FILE = this.db_file;

    // Run the migrations to ensure our schema has the required structure
    await exec(`${prismaBinary} migrate up --create-db --experimental --schema=./prisma/schema-dev.prisma`);
    return super.setup();
  }
  async teardown() {
    // Drop the schema after the tests have completed
    await this.db.close(function (err) {
      if (err) throw err;
    });
  }
}
module.exports = PrismaTestEnvironment;
