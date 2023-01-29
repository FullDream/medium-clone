import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store'

import { RegisterComponent } from './components/register'
import { authReducer, authReducerKey } from './store/auth.reducer'
import { EffectsModule } from '@ngrx/effects'
import { RegisterEffect } from './store/effects'
import { AuthSevice } from './services'
import { BackendErrorsMessagesComponent } from '../common/components/backend-errors-messages/backend-errors-messages.component'
import { PersistanceService } from '../common/services/persistance.service'

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
		EffectsModule.forFeature([RegisterEffect]),

		BackendErrorsMessagesComponent,
	],
	declarations: [RegisterComponent],
	providers: [AuthSevice, PersistanceService],
	exports: [RegisterComponent],
})
export class AuthModule {}
