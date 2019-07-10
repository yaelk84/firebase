import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpClient, HttpHeaders,HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BranchBoxComponent } from './features/branch-box/branch-box.component';
import { BranchListComponent } from './features/branch-list/branch-list.component';
import { HomeComponent } from './features/home/home.component';
import { BranchHoursComponent } from './features/branch-hours/branch-hours.component';
import {RcUiModule} from '@realcommerce/rc-packages';
import { BranchBoxSummarizeComponent } from './features/branch-box-summarize/branch-box-summarize.component';
import { BranchFiltersComponent } from './features/branch-filters/branch-filters.component';
import { FilterBranchPipe} from './core/filters/branch-filter.pipe';
import { CheckBoxFilterComponent } from './features/check-box-filter/check-box-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    BranchBoxComponent,
    BranchListComponent,
    HomeComponent,
    BranchHoursComponent,
    BranchBoxSummarizeComponent,
    BranchFiltersComponent,
    FilterBranchPipe,
    CheckBoxFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RcUiModule
  ],
  providers: [FilterBranchPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
