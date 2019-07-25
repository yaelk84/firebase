import {Component, OnInit} from '@angular/core';
import {catchError, map, switchMap} from 'rxjs/operators';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {HoursService} from '../../core/services/hours.service';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {logger} from 'codelyzer/util/logger';
import {AppService} from '../../core/services/app.service';

// import {GeoLocationObject} from "../../core/interface/coordinates";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  activeFilters = [];
  servicesLoaded = false;
  openPopup = true;
  branches: Array<object> = null;

  constructor(private  apiService: ApiService, private  hours: HoursService, private mapBranches: MapBranchesService, private appService: AppService) {
  }






  ngOnInit() {
      this.appService.init().subscribe((response: any) => {

        this.mapBranches.myLocationFilter(response.location, response.branche).subscribe((res =>{
          this.servicesLoaded = true;
        }))
        console.log('yyyyyyyyyyyyyyyyyy')
       this.hours.updateTime = response.time;
      this.branches = response.branches;
        const cities = response.branches.map(obj =>{
          return obj.geographicAddress[0].cityName;
        })
        debugger
        const  uniquset = new Set(cities);
        const backArray = uniquset["entries"]();


          }, (err) => {
      console.log(err);

    });

  }
}
