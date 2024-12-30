import { DatabaseModule } from "@infra/db/database.module"
import { AppModule, BaseDiModule } from "@infra/di/index"
import { type MiddlewareConsumer, Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AuthController } from "./controllers/auth/auth.controller"
import { CommentsController } from "./controllers/comment/comment.controller"
import { HealthController } from "./controllers/health/health.controller"
import { PostsController } from "./controllers/post/post.controller"
import { UsersController } from "./controllers/user/user.controller"
import { JwtGuard } from "./utils/guards/jwt.guard"

@Module({
  imports: [AppModule, DatabaseModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  controllers: [
    HealthController,
    AuthController,
    UsersController,
    PostsController,
    CommentsController,
  ],
})
export class WebModule {
  configure(consumer: MiddlewareConsumer) {}
}
