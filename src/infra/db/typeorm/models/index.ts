import { CommentModel } from "./comment.model"
import { LikeModel } from "./like.model"
import { PostModel } from "./post.model"
import { ProfileOwnerModel } from "./profileOwner.model"
import { UserModel } from "./user.model"

export const publicModels = {
  userModel: UserModel,
  profileOwnerModel: ProfileOwnerModel,
  post: PostModel,
  like: LikeModel,
  comment: CommentModel,
}
