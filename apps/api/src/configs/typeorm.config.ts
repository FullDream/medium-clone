import { DataSourceOptions } from 'typeorm'
import { TagEntity } from '../app/tag/tag.entity'
import { UserEntity } from '../app/user/user.entity';
import { ArticleEntity } from '../app/article/article.entity';

export const TypeOrmConfig: DataSourceOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'medium-clone',
	password: 'pgpwmedium',
	database: 'mediumclone',
	entities: [TagEntity, UserEntity, ArticleEntity],
	synchronize: true,
}
