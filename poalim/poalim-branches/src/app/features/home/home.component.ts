import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {HoursService} from '../../core/services/hours.service';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {AppService} from '../../core/services/app.service';
import {BranchDataService} from '../../core/services/branch-data.service';
import {CONSTANTS} from '../../constants';
import {RcEventBusService, RcTranslateService} from '@realcommerce/rc-packages';
import {interval} from 'rxjs';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {FormControl} from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {


  servicesLoaded = false;
  branches: Array<object> = null;
  branchNewArrayFilter: Array<object> = []; // branch list and map use that shared data
  branchResultTitle: string;
  intervalTimer: any;
  location: any;
  formControl = new FormControl();

  constructor(private  apiService: ApiService, private  hours: HoursService, private mapBranches: MapBranchesService, private appService: AppService, private branchDataServices: BranchDataService, private events: RcEventBusService, private translate: RcTranslateService, private  mapServices: MapBranchesService, private filterBranch: BranchFilterService) {
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
          this.intervalTimer =setTimeout(() => {
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
      console.log('refresh list wad called' , this.branchDataServices.branchesFilter.length)
      this.branchNewArrayFilter = this.branchDataServices.branchesFilter;
      if (this.branchDataServices.citySelected.length) {
        this.branchResultTitle = this.translate.getText('branchFoundCity', [this.branchNewArrayFilter.length, this.branchDataServices.citySelected]);
      } else {
        const branchResultTitle = this.mapServices.hasLocationPermission ? 'branchFound' : 'branchFoundNoLocation';
        this.branchResultTitle = this.translate.getText(branchResultTitle, [this.branchNewArrayFilter.length]);
      }


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
    setInterval(() => {

      this.apiService.getGetCurrentTimeStamp().subscribe(
        (res) => {
          console.log('interval');
          this.hours.updateTime = res.time;
          this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices.createDataArray(this.mapServices.sortedBranches), this.filterBranch.activeFilters);
        }
      );

    }, 1000 * 60);
  }
  ngOnDestroy() {
    console.log('destroy');
    this.intervalTimer.clearTimeout();
  }

}
