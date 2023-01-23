import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
	},
]
@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		StoreModule.forRoot(
			{},
			{
				metaReducers: [],
				runtimeChecks: {
					strictActionImmutability: true,
					strictStateImmutability: true,
				},
			},
		),
		EffectsModule.forRoot([]),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
