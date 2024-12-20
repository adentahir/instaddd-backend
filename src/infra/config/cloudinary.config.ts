import "dotenv/config"
import * as env from "env-var"

const CLOUDINARY_CLOUD_NAME = env
  .get("CLOUDINARY_CLOUD_NAME")
  .required()
  .asString()
const CLOUDINARY_API_KEY = env.get("CLOUDINARY_API_KEY").required().asString()

const CLOUDINARY_API_SECRET = env
  .get("CLOUDINARY_API_SECRET")
  .required()
  .asString()

export default {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
}
