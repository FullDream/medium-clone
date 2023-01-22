import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthGuard } from '../user/guards/auth.guard'
import { UserEntity } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [ProfileController],
	providers: [UserService, ProfileService, AuthGuard],
})
export class ProfileModule {}
