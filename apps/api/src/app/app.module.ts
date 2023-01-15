import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfig } from '../configs/typeorm.config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TagModule } from './tag/tag.module'
import { AuthMiddleware } from './user/middlewares/auth.middleware'
import { UserModule } from './user/user.module'

@Module({
	imports: [TypeOrmModule.forRoot(TypeOrmConfig), TagModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
	}
}
