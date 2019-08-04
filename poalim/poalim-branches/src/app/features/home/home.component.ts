import {Component, OnInit} from '@angular/core';
import {HoursService} from '../../core/services/hours.service';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {AppService} from '../../core/services/app.service';
import {BranchDataService} from '../../core/services/branch-data.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  activeFilters = [];
  servicesLoaded = false;
  branches: Array<object> = null;


  location: any;

  constructor(private  apiService: ApiService, private  hours: HoursService, private mapBranches: MapBranchesService, private appService: AppService , private branchDataServices: BranchDataService) {
  }

  getServicers() {
    this.appService.init().subscribe((response: any) => {

      this.hours.updateTime = response.time;
      this.branches = response.branches;
      const cities = response.branches.map(obj => {
        return obj.geographicAddress[0].cityName;
      });
      if (this.mapBranches.hasLocationPermission) {
        this.servicesLoaded = false;
        this.mapBranches.myLocationFilter(this.location, response.branches).subscribe((res => {
          this.servicesLoaded = true;
          this.mapBranches.hasLocationPermissionFromGeoLocation = true;
          this.mapBranches.nearsBranches = res;
          this.branchDataServices.initBrnchesAndMap( this.branchDataServices.createDataArray(this.mapBranches.sortedBranches));
               }));
      } else {
        this.mapBranches.defaultFilter(this.branches);
        this.branchDataServices.initBrnchesAndMap( this.branchDataServices.createDataArray(this.mapBranches.sortedBranches));
        this.servicesLoaded = true;

      }


    }, (err) => {
      console.log(err);

    });
  }

  ngOnInit() {
    return this.mapBranches.getMyLocation()
      .subscribe(x => {
          // console.log('Observer got a next value: ' + x);

          this.getServicers();
          this.location = x;
          console.log('success');
        },
        (err) => {
          this.getServicers();
          console.error('Observer got an error: ');
        },
        () => {
          console.log('Observer got a complete notification');
        });


  }
}
