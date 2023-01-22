import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { UserEntity } from '../user/user.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { Observable, from, mergeMap, forkJoin, map, tap } from 'rxjs'
import { ArticleEntity } from './article.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, getRepository, Repository } from 'typeorm'
import { ArticleResponse } from './types/article-response.interface'
import slugify from 'slugify'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticlesQuery } from './types/articles-query.interface'
import { ArticlesResponse } from './types/articles-response.interface'
@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
	) {}

	public async findAll(
		userId: number,
		{ limit, offset, author, tag }: ArticlesQuery,
	): Promise<ArticlesResponse> {
		const queryBuilder = this.articleRepository
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')

		queryBuilder.orderBy('articles.createdAt', 'DESC')

		const articlesCount = await queryBuilder.getCount()

		if (tag) {
			queryBuilder.andWhere('articles.tagList LIKE :tag', {
				tag: `%${tag}%`,
			})
		}

		if (author) {
			const authorRep = await this.userRepository.findOne({ where: { username: author } })
			queryBuilder.andWhere('articles.authorId = :id', { id: authorRep.id })
		}

		if (limit) queryBuilder.limit(limit)
		if (offset) queryBuilder.offset(offset)

		const articles = await queryBuilder.getMany()

		return { articles, articlesCount }
	}

	public create(user: UserEntity, createArticleDto: CreateArticleDto): Observable<ArticleEntity> {
		const article = new ArticleEntity()
		Object.assign(article, createArticleDto)
		article.slug = this.getSlug(createArticleDto.title)

		if (!article.tagList) {
			article.tagList = []
		}
		article.author = user

		return from(this.articleRepository.save(article))
	}

	public findBySlug(slug: string): Observable<ArticleEntity> {
		return from(this.articleRepository.findOne({ where: { slug } }))
	}

	public update(
		slug: string,
		userId: number,
		updateArticleDto: UpdateArticleDto,
	): Observable<ArticleEntity> {
		return this.findBySlug(slug).pipe(
			mergeMap(article => {
				if (!article) {
					throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
				}

				if (article.author.id !== userId) {
					throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
				}

				const newArticle = { ...article, ...updateArticleDto }

				if (updateArticleDto.title && updateArticleDto.title !== article.title) {
					newArticle.slug = this.getSlug(updateArticleDto.title)
				}

				return from(this.articleRepository.save(newArticle))
			}),
		)
	}

	public delete(slug: string, userId: number): Observable<DeleteResult> {
		return this.findBySlug(slug).pipe(
			mergeMap(article => {
				if (!article) {
					throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
				}

				if (article.author.id !== userId) {
					throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
				}

				return from(this.articleRepository.delete({ slug }))
			}),
		)
	}

	public buildArticleResponse(article: ArticleEntity): ArticleResponse {
		return { article }
	}

	private getSlug(title: string): string {
		return (
			slugify(title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString()
		)
	}
}
