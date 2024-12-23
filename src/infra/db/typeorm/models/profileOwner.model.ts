import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm"
import { CommentModel } from "./comment.model"
import { LikeModel } from "./like.model"
import { PostModel } from "./post.model"
import { UserModel } from "./user.model"

@Entity("profileOwner")
export class ProfileOwnerModel {
  @PrimaryColumn("uuid", {
    name: "id",
    type: "uuid",
    unique: true,
  })
  id: string

  @Column("character varying", {
    name: "username",
    length: 128,
    unique: true,
  })
  username: string

  @Column("character varying", {
    name: "fullName",
    length: 128,
  })
  fullName: string

  @Column("character varying", {
    name: "avatar",
    nullable: true,
    length: 128,
  })
  avatar: string

  @Column("boolean", {
    name: "isPrivate",
    default: false,
  })
  isPrivate: boolean

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date

  /// 1:1 relationship
  @OneToOne(
    () => UserModel,
    user => user.profileOwner,
  )
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserModel // UserModel    TODO: fix this circular dependency

  @OneToMany(
    () => PostModel,
    post => post.profileOwner,
  )
  posts: PostModel[]

  @OneToMany(
    () => CommentModel,
    comment => comment.profileOwner,
  )
  comments: CommentModel[]

  @OneToMany(
    () => LikeModel,
    like => like.profileOwner,
  )
  likes: LikeModel[]

  // Self-referencing relationships for followers and following
  @OneToMany(
    () => ProfileOwnerModel,
    profile => profile.following,
  )
  followers: ProfileOwnerModel[]

  @OneToMany(
    () => ProfileOwnerModel,
    profile => profile.followers,
  )
  following: ProfileOwnerModel[]
}
