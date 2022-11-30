import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfig } from '../configs/typeorm.config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TagModule } from './tag/tag.module'

@Module({
	imports: [TypeOrmModule.forRoot(TypeOrmConfig), TagModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
