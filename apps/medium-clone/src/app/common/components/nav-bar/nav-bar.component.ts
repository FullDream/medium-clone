import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Store, select } from '@ngrx/store'
import {
	isAnonymousSelector,
	isLoggedInSelector,
	currentUserSelector,
} from '../../../auth/store/auth.selectors'

@Component({
	selector: 'mc-nav-bar',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './nav-bar.component.html',
})
export class NavBarComponent {
	public isLoggedIn$ = this.store.pipe(select(isLoggedInSelector))
	public isAnonymous$ = this.store.pipe(select(isAnonymousSelector))
	public currentUser$ = this.store.pipe(select(currentUserSelector))

	constructor(private readonly store: Store) {}
}
