import { Injectable } from '@angular/core'

@Injectable()
export class PersistanceService {
	public set<T>(key: string, data: T): void {
		try {
			console.log(data)

			localStorage.setItem(key, JSON.stringify(data))
		} catch (error) {
			console.error('Error saving to local storage', error)
		}
	}

	public get<R>(key: string): R | null {
		try {
			return JSON.parse(localStorage.getItem(key) as string)
		} catch (error) {
			return null
		}
	}
}
