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
import {GeneralPopupComponent} from './features/general-popup/general-popup.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SingleBranchDisplayComponent } from './features/single-branch-display/single-branch-display.component';
import { HoursFilerComponent } from './features/hours-filer/hours-filer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchComponent } from './features/search/search.component';
import {FormsModule} from '@angular/forms';
import { NoLocationPermissionsComponent } from './features/no-location-permissions/no-location-permissions.component';
import { ReportProblemPopupComponent } from './features/report-problem-popup/report-problem-popup.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { MapComponent } from './features/map/map.component';
import { AgmCoreModule  } from '@agm/core';

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
    CheckBoxFilterComponent,
    GeneralPopupComponent,
    SingleBranchDisplayComponent,
    HoursFilerComponent,
    BranchHoursComponent,
    NoLocationPermissionsComponent,
    SearchComponent,
    ReportProblemPopupComponent
    GeneralPopupComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RcUiModule,
    NgSelectModule,
    FormsModule,
    PerfectScrollbarModule
    RcUiModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCbhniBexRx0tx-iVCPLSqGwppLoebHJTU',
      libraries: ['geometry']
      // AIzaSyDDTZwjyoMs46iFEvwssnCNppYxAjBJVT8
    })
  ],
  providers: [FilterBranchPipe, {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
