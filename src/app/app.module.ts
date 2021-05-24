import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderModule } from './shared/components/header/header.module';
import { CharactersCardModule } from './components/pages/characters/characters-card/characters-card.module';
import { CharactersListModule } from './components/pages/characters/characters-list/characters-list.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { ToastrModule } from 'ngx-toastr';
import { SpinerModule } from './shared/components/spiner/spiner.module';
import { SpinnerInterceptor } from './shared/interceptors/spiner.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    HeaderModule,
    CharactersCardModule,
    CharactersListModule,
    //ToastrModule.forRoot(),
    BrowserAnimationsModule,
    SpinerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass:SpinnerInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
