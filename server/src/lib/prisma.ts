import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "../config/index.js";
import { PrismaClient } from "../../generated/prisma/client.js";

const connectionString = config.database_url;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
