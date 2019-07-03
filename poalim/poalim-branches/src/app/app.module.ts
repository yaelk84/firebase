import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BranchBoxComponent } from './features/branch-box/branch-box.component';
import { BranchListComponent } from './features/branch-list/branch-list.component';
import { HomeComponent } from './features/home/home.component';
import { BranchHoursComponent } from './features/branch-hours/branch-hours.component';
import { RcUiModule } from '@realcommerce/rc-packages';
import { NgSelectModule } from '@ng-select/ng-select';

import { SearchComponent } from './features/search/search.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BranchBoxComponent,
    BranchListComponent,
    HomeComponent,
    BranchHoursComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RcUiModule,
    NgSelectModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
