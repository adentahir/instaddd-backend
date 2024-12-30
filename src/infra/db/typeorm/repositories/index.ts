import { CommentProvider } from "./comment.repository-typeorm"
import { PostProvider } from "./post.repository-typeorm"
import { ProfileOwnerRepoProvider } from "./profileOwner.repository-typeorm"
import { UserRepoProvider } from "./user.repository-typeorm"

export const REPOS = [
  UserRepoProvider,
  ProfileOwnerRepoProvider,
  CommentProvider,
  PostProvider,
]
