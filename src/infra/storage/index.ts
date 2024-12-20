import { Readable } from "node:stream"
import {
  StorageService,
  StorageServiceError,
} from "@app/services/storage.service"
import config from "@infra/config"
import { Injectable, Provider } from "@nestjs/common"
import { ValidationResult } from "@shared/utils"
import { v2 as cloudinary } from "cloudinary"

@Injectable()
class CloudinaryStorage extends StorageService {
  constructor() {
    super()

    cloudinary.config({
      api_key: config.cloudinary.CLOUDINARY_API_KEY,
      cloud_name: config.cloudinary.CLOUDINARY_CLOUD_NAME,
      api_secret: config.cloudinary.CLOUDINARY_API_SECRET,
    })
  }

  async add(data: Buffer): Promise<{ url: string }> {
    const readable = Readable.from(data)

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "instaclone" },
        (err, res) => {
          if (res) {
            resolve({ url: res.url })
          } else {
            reject(err)
          }
        },
      )

      readable.pipe(stream, { end: true })
    })
  }

  async remove(
    url: string,
  ): Promise<ValidationResult<null, StorageServiceError>> {
    const split = url.split("/")
    const filename = split[split.length - 1]
    const publicId = filename.split(".")[0]

    try {
      const res = await cloudinary.uploader.destroy(`instaclone/${publicId}`, {
        resource_type: "image",
      })
      return { success: true, data: null }
    } catch (err) {
      console.error(err)

      return {
        success: false,
        error: new StorageServiceError(
          "something went wrong deleting the image",
        ),
      }
    }
  }
}

export const StorageServiceProvider: Provider<StorageService> = {
  provide: StorageService,
  useClass: CloudinaryStorage,
}
