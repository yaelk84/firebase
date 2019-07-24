import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {of} from 'rxjs';
import {ApiService} from '../../core/services/api.service';
import {HoursService} from '../../core/services/hours.service';
import {MapBranchesService} from '../../core/services/map-branches.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   activeFilters = [];
   servicesLoaded = false;
   openPopup = true;
  public branches: Array<object> = null;

  constructor( private  apiService: ApiService , private  hours: HoursService, private mapBranches: MapBranchesService) { }

  ngOnInit() {
    console.log("on init")
    this.apiService.getGetCurrentTimeStamp()
      .subscribe((response) => {
          console.log( 'respose' , response)
          this.hours.updateTime  = response.time;
          this.servicesLoaded = true;

          return of({});
        });
    this.apiService.getBranches().subscribe((data) => {
      this.branches = data;
    });
    this.mapBranches.getMyLocation().subscribe(res => {
      if (this.mapBranches.checkIfHaveLocation(res)) {
        this.mapBranches.hasLocationPermission = true;
      }
    }, (error1 => this.mapBranches.hasLocationPermission = false));
  }

}
