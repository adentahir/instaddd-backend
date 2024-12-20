import * as dotenv from "dotenv"
import "dotenv/config"
import * as env from "env-var"

dotenv.config()

const DATABASE_URL: string =
  env.get("DATABASE_URL").required().asUrlString() || "postgresql://"

const DB_USERNAME: string = env.get("DB_USERNAME").required().asString()
const DB_NAME: string = env.get("DB_NAME").required().asString()
const DB_PASSWORD: string = env.get("DB_PASSWORD").required().asString()
const DB_HOST: string = env.get("DB_HOST").required().asString()
const DB_PORT: number = env.get("DB_PORT").required().asInt()
const DB_SCHEMA: string = env.get("DB_SCHEMA").required().asString()

const DatabaseConfig = {
  DATABASE_URL,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DB_NAME,
  DB_SCHEMA,
}

export default DatabaseConfig
