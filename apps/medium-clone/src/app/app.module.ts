import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule, Routes } from '@angular/router'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { EffectsModule } from '@ngrx/effects'

import { AppComponent } from './app.component'
import { environment } from '../environments/environment'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NavBarComponent } from './common/components/nav-bar/nav-bar.component'
import { AuthModule } from './auth/auth.module'
import { PersistanceService } from './common/services/persistance.service'
import { AuthInterceptor } from './common/services/auth.interceptor'

const routes: Routes = []
@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
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
		StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
		EffectsModule.forRoot([]),

		AuthModule,
		NavBarComponent,
	],
	providers: [
		PersistanceService,
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
