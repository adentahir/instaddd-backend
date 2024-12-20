import config from "@infra/config"
import { DataSource, type DataSourceOptions } from "typeorm"
import { publicModels } from "./typeorm/models"

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export const entities = Object.values(publicModels) as Function[]
entities.push(...Object.values(publicModels))

const ds = new DataSource({
  url: config.db.DATABASE_URL,
  password: config.db.DB_PASSWORD,
  database: config.db.DB_NAME,
  host: config.db.DB_HOST,
  username: config.db.DB_USERNAME,
  useUTC: true,
  entities: entities,

  synchronize: true, // set to false in production
  schema: config.db.DB_SCHEMA,
  type: "postgres",
} as DataSourceOptions)

ds.initialize()
  .then(() => {
    console.log("DB is initialized")
  })
  .catch(e => console.log(e))

export default ds
