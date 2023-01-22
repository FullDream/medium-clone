export interface ArticlesQuery {
	tag?: string
	author?: string
	favorited?: string
	limit?: number
	offset?: number
}

export type ArticlesFeedQuery = Pick<ArticlesQuery, 'offset' | 'limit'>
