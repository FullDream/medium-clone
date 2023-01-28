import {
	BeforeInsert,
	Column,
	Entity,
	JoinTable,
	OneToMany,
	PrimaryGeneratedColumn,
	ManyToMany,
} from 'typeorm'
import { hash } from 'bcrypt'
import { ArticleEntity } from '../article/article.entity'
import { CurrentUserInterface } from '@medium-clone/api-interfaces'

@Entity({ name: 'users' })
export class UserEntity implements Omit<CurrentUserInterface, 'token'> {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	email: string

	@Column()
	username: string

	@Column({ default: '' })
	bio: string

	@Column({ default: '' })
	image: string

	@Column({ select: false })
	password: string

	@BeforeInsert()
	async hashPassword(): Promise<void> {
		this.password = await hash(this.password, 10)
	}

	@OneToMany(() => ArticleEntity, article => article.author)
	articles: ArticleEntity[]

	@ManyToMany(() => ArticleEntity)
	@JoinTable()
	favorites: ArticleEntity[]
}
