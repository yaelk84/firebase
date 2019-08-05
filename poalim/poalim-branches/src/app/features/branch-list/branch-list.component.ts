import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
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

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, AfterViewInit {

  public config: PerfectScrollbarConfigInterface = {};
  private city: string;


  constructor(private branchDataServices: BranchDataService, private apiService: ApiService, private branchFilterService: BranchFilterService, private pipe: FilterBranchPipe, private events: RcEventBusService, private activeRoute: ActivatedRoute, private  mapServices: MapBranchesService, private  router: Router, private hours: HoursService, private translate: RcTranslateService) {
  }

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
  branchResultTitle: string;
  filterIcon = this.filterWithNoHours;
  branchNewArrayFilter: any;
  private branchData: any[];

  private buildFilterByQuery(queryParams) {

    if (!isNullOrUndefined(queryParams.branch && queryParams.branch.length)) {
      const branches = this.branchDataServices.branchesFilter;
      this.branchSelectedDisplay = branches.filter((value) => {
        return queryParams.branch === String(value.branchSummarize.branchNum);
      })[0];
      if (isNullOrUndefined(this.branchSelectedDisplay)) {
        return;
      }
      this.showSelectedBranch = true;
    } else {
      this.showSelectedBranch = false;
    }
    if (!isNullOrUndefined(queryParams.city && queryParams.city.length)) {
      this.branchFilterService.selectedCity = queryParams.city;
      this.branchFilterService.toggleFilter(CONSTANTS.FILTER_BY_CITY);
    }


  }

  private callQueryParam() {
    this.activeRoute.queryParams.subscribe((queryParams) => {
      this.buildFilterByQuery(queryParams);
    });
  }

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  closeDropDown() {
    this.showDaysHoursFilter = false;
  }

  backToResults() {
    this.showSelectedBranch = false;
    this.selectBranch(null);

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
    console.log('55',);
    if (!isNullOrUndefined(e) && Object.keys(e).length) {
      e.stopPropagation();
    }
    this.showDaysHoursFilter = !this.showDaysHoursFilter;
  }

  addEvents() {
    this.events.on(CONSTANTS.EVENTS.UPDATE_FILTER, (filters) => {
      this.selectBranch(null);
      const activeFilter = this.branchFilterService.getActiveFilters();
      console.log('activeFilters !!!!!!', activeFilter);
      this.handleFilterChange(activeFilter);

    }, true);
    this.events.on(CONSTANTS.EVENTS.REFRESH_LIST, () => {

      const branchResultTitle = this.mapServices.hasLocationPermission ? 'branchFound' : 'branchFoundNoLocation';
      this.branchNewArrayFilter = this.branchDataServices.branchesFilter;
      this.branchResultTitle = this.translate.getText(branchResultTitle, [this.branchNewArrayFilter.length]);
    }, true);
  }

  ngOnInit() {

    // this.city = this.route.snapshot.paramMap.get("city");
    this.addEvents();
    this.filters = this.branchFilterService.filters;
    this.branchData = this.mapServices.sortedBranches;
    this.branchResultTitle = this.mapServices.hasLocationPermission ? 'branchFound' : 'branchFoundNoLocation';


  }

  ngAfterViewInit() {
    // this.componentRef.directiveRef.ps().update();
    this.callQueryParam();
    interval(1000 * 60).subscribe(x => {
      // this.init();

    });

  }


}
