import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { getCurrentUserAction } from './auth/store/actions/get-current-user.actions'

@Component({
	selector: 'mc-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	constructor(private readonly store: Store) {}
	ngOnInit(): void {
		this.store.dispatch(getCurrentUserAction())
	}
}
