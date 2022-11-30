import { DataSourceOptions } from 'typeorm'

export const TypeOrmConfig: DataSourceOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'mediumclone',
	password: '123',
	database: 'mediumclone',
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	synchronize: true,
}
