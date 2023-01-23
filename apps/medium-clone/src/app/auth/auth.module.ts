import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store'

import { RegisterComponent } from './components/register'
import { authReducer, authReducerKey } from './store/auth.reducer'

const routes: Routes = [
	{
		path: 'register',
		component: RegisterComponent,
	},
]

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature(authReducerKey, authReducer),
	],
	declarations: [RegisterComponent],
	providers: [],
	exports: [RegisterComponent],
})
export class AuthModule {}
