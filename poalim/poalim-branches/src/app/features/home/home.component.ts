import {Component, OnInit} from '@angular/core';
import {HoursService} from '../../core/services/hours.service';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {AppService} from '../../core/services/app.service';
import {BranchDataService} from '../../core/services/branch-data.service';
import {CONSTANTS} from '../../constants';
import {RcEventBusService, RcTranslateService} from '@realcommerce/rc-packages';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  servicesLoaded = false;
  branches: Array<object> = null;
  branchNewArrayFilter: Array<object> = []; // branch list and map use that shared data
  branchResultTitle: string;

  location: any;

  constructor(private  apiService: ApiService, private  hours: HoursService, private mapBranches: MapBranchesService, private appService: AppService, private branchDataServices: BranchDataService, private events: RcEventBusService, private translate: RcTranslateService, private  mapServices: MapBranchesService) {
  }

  /**
   * call services from server and update data
   * **/
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
          setTimeout(() => {
            this.servicesLoaded = true;
          }, 200);
          this.mapBranches.hasLocationPermissionFromGeoLocation = true;
          this.mapBranches.nearsBranches = res;
          this.branchDataServices.initBrnchesAndMap(this.branchDataServices.createDataArray(this.mapBranches.sortedBranches));
        }));
      } else {
        this.mapBranches.defaultFilter(this.branches); // update sorted branches
        this.branchDataServices.initBrnchesAndMap(this.branchDataServices.createDataArray(this.mapBranches.sortedBranches));
        this.servicesLoaded = true;

      }


    }, (err) => {
      console.log(err);

    });
  }

  ngOnInit() {
    this.events.on(CONSTANTS.EVENTS.REFRESH_LIST, () => {
      this.branchNewArrayFilter = this.branchDataServices.branchesFilter;
      console.log("the branch filter ",  this.branchNewArrayFilter )
      const branchResultTitle = this.mapServices.hasLocationPermission ? 'branchFound' : 'branchFoundNoLocation';
      this.branchResultTitle = this.translate.getText(branchResultTitle, [this.branchNewArrayFilter.length]);

    }, true);
    return this.mapBranches.getMyLocation()
      .subscribe(x => {
          // console.log('Observer got a next value: ' + x);

          this.getServicers();
          this.location = x;
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
