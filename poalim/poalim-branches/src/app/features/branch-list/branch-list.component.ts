import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {BranchObj} from '../../core/models/branch-model';
import {BranchDataService} from '../../core/services/branch-data.service';
import {ApiService} from '../../core/services/api.service';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {FilterBranchPipe} from '../../core/filters/branch-filter.pipe';
import {RcEventBusService, RcTranslateService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {FormControl} from '@angular/forms';
import {PerfectScrollbarConfigInterface, PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {interval} from 'rxjs';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {HoursService} from '../../core/services/hours.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {AppService} from '../../core/services/app.service';


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, AfterViewInit {

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @Input() branchNewArrayFilter: any;
  @Input() branchResultTitle: any;

  public config: PerfectScrollbarConfigInterface = {};
  private city: string;

  filters = [];
  formControl = new FormControl();
  branchSelectedDisplay: object;
  showSelectedBranch = false;
  filterByDay = false;
  filterByHours = false;
  dayName = '';
  showDaysHoursFilter = false;
  filterWithHours = '/assets/media/hour-filter.svg';
  filterWithNoHours = '/assets/media/no-filter-hours.svg';
  arrow = '/assets/media/left.svg';
  showNoLocation = false;
  intervalTimer: any;

  filterIcon = this.filterWithNoHours;


  constructor(private branchDataServices: BranchDataService, private apiService: ApiService, private branchFilterService: BranchFilterService, private pipe: FilterBranchPipe, private events: RcEventBusService, private activeRoute: ActivatedRoute, private  mapServices: MapBranchesService, private  router: Router, private hours: HoursService, private appService: AppService) {
  }

  private branchData: any[];
  private buildFilterByQuery(queryParams) {
    this.branchDataServices.citySelected = '';
    this.showSelectedBranch = false;

    const getSingleBranch = () => {
      debugger;
      let branchSelectedDisplay: any;
      const branches = this.branchDataServices.branchesFilter;
      const branchFromList = this.appService.branches;
      branchSelectedDisplay = branches.filter((value) => {
        return queryParams.branch === String(value.branchSummarize.branchNum);
      })[0];
      if (!isNullOrUndefined(branchSelectedDisplay)) {
        return branchSelectedDisplay;
      } else {
        branchSelectedDisplay = branchFromList.filter((value) => {
          return queryParams.branch === String(value.branchNumber);
        })[0];
        if (!isNullOrUndefined(branchSelectedDisplay)) {
          return this.branchDataServices.createSingleBranch(branchSelectedDisplay);
        }
      }
      return branchSelectedDisplay;
    };

    if (!isNullOrUndefined(queryParams.branch && queryParams.branch.length)) {

      const branchSelectedDisplay = getSingleBranch();
      if (isNullOrUndefined(branchSelectedDisplay)) {
        return;
      } else {
        this.branchSelectedDisplay = branchSelectedDisplay;
        this.showSelectedBranch = true;
      }
    } else if (!isNullOrUndefined(queryParams.city && queryParams.city.length)) {
      this.branchDataServices.citySelected = queryParams.city;
      if (this.branchFilterService.activeFilters.indexOf(CONSTANTS.FILTER_lOCATION) > -1) {
        this.branchFilterService.toggleFilter(CONSTANTS.FILTER_lOCATION);
      }
      const city = queryParams.city;
      const branches = this.appService.branches.filter((branch) => {
        return branch.geographicAddress[0].cityName === city;
      });
      if (this.mapServices.hasLocationPermission) {
        this.mapServices.myLocationFilter(this.mapServices.position as GeoLocationObject, branches).subscribe((res) => {
          const branchesFilter = this.branchDataServices.createDataArray(this.mapServices.sortedBranches);
          this.branchDataServices.initBranchesAndApplyFilters(branchesFilter, this.branchFilterService.activeFilters);
        });
      } else {
        this.mapServices.sortedBranches = branches;
        const branchesFilter = this.branchDataServices.createDataArray(this.mapServices.sortedBranches).slice(0, 10);
        this.branchDataServices.initBranchesAndApplyFilters(branchesFilter, this.branchFilterService.activeFilters);
      }

      this.branchDataServices.isSingleDisplay = this.showSelectedBranch;
      this.branchDataServices.isShowSnazzyInfoWindow = this.showSelectedBranch;
    } else {
      if (!this.mapServices.hasLocationPermission) {
        this.mapServices.defaultFilter(this.appService.branches);
        this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices.createDataArray(this.mapServices.sortedBranches), this.branchFilterService.activeFilters);
      }else{
        this.mapServices.changeFilterLoactionToTrue();
        this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices.createDataArray(this.mapServices.sortedBranches), this.branchFilterService.activeFilters);

      }

    }
  }

  private callQueryParam() {
    this.activeRoute.queryParams.subscribe((queryParams) => {
      this.buildFilterByQuery(queryParams);
    });
  }

  closeDropDown() {
    this.showDaysHoursFilter = false;
  }

  closePopupLocation() {
    console.log('777777777777');
    this.showNoLocation = false;
  }

  backToResults() {
    this.router.navigate([], {queryParams: {}, relativeTo: this.activeRoute});


  }

  selectBranch(id) {
    if (isNullOrUndefined(id)) {
      this.showSelectedBranch = false;
      this.router.navigate([], {queryParams: {}, relativeTo: this.activeRoute});
    } else {
      this.router.navigate([], {queryParams: {branch: id}, relativeTo: this.activeRoute});
    }

  }

  handleFilterChange(activeFilter) {
    this.filterByHours = activeFilter.indexOf(CONSTANTS.FILTER_BY_HOURS) > -1;
    this.filterByDay = activeFilter.indexOf(CONSTANTS.FILTER_BY_DAYS) > -1;
    this.dayName = this.hours.selectedDays;

  }

  toggleDropDown(e) {

    if (!isNullOrUndefined(e) && Object.keys(e).length) {
      e.stopPropagation();
    }
    this.showDaysHoursFilter = !this.showDaysHoursFilter;
  }

  addEvents() {
    this.events.on(CONSTANTS.EVENTS.REFRESH_LIST, (filters) => {
      if (this.showSelectedBranch && this.branchFilterService.dirty) {
        this.selectBranch(null);
      }
      const activeFilter = this.branchFilterService.getActiveFilters();
      this.handleFilterChange(activeFilter);

    }, true);

  }

  ngOnInit() {

    // this.city = this.route.snapshot.paramMap.get("city");
    this.addEvents();
    this.filters = this.branchFilterService.filters;
    this.branchData = this.mapServices.sortedBranches;
    if (!this.mapServices.hasLocationPermissionFromGeoLocation) {
      this.showNoLocation = true;
    }
  }

  ngAfterViewInit() {
    // this.componentRef.directiveRef.ps().update();
    this.callQueryParam();
    this.intervalTimer = setInterval(() => {
      console.log('123');
      this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices.createDataArray(this.mapServices.sortedBranches), this.branchFilterService.activeFilters);
    }, 5000 * 60);


  }



}
