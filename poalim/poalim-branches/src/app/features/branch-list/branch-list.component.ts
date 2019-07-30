import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {BranchObj} from '../../core/models/branch-model';
import {BranchDataService} from '../../core/services/branch-data.service';
import {ApiService} from '../../core/services/api.service';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {FilterBranchPipe} from '../../core/filters/branch-filter.pipe';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {FormControl} from '@angular/forms';
import {PerfectScrollbarConfigInterface, PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {interval} from 'rxjs';
import {MapBranchesService} from '../../core/services/map-branches.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, AfterViewInit {

  public config: PerfectScrollbarConfigInterface = {};
  private city: string;

  constructor(private branchDataServices: BranchDataService, private apiService: ApiService, private branchFilterService: BranchFilterService, private pipe: FilterBranchPipe, private events: RcEventBusService, private activeRoute: ActivatedRoute, private  mapServices: MapBranchesService, private  router: Router) {
  }

  data;
  branchNewArray: BranchObj[] = [];
  filters = [];
  branchNewArrayFilter: BranchObj[] = [];
  formControl = new FormControl();
  branchSelectedDisplay: object;
  showSelectedBranch = false;
  filterByDay = false;
  filterByHours = false;
  dayName = '';
  showDaysHoursFilter = false;
  filterWithHours = '/assets/media/hour-filter.svg';
  filterWithNoHours = '/assets/media/no-filter-hours.svg';
  arrow =  '/assets/media/left.svg';
  branchResultTitle: string = 'branchFound';
  filterIcon = this.filterWithNoHours;
  private branchData: any[];

  private buildFilterByQuery(queryParams) {

    if (!isNullOrUndefined(queryParams.branch && queryParams.branch.length)) {
      this.branchSelectedDisplay = this.branchNewArrayFilter.filter((value) => {
        return  String(value.branchSummarize.branchNum) === queryParams.branch;
      })[0];
      if( isNullOrUndefined( this.branchSelectedDisplay)){return}
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

  private buildTitleBranchList() {

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
    this.dayName = this.branchFilterService.selectedDays;

  }

  toggleDropDown(e) {

    if (!isNullOrUndefined(e) && Object.keys(e).length){
      e.stopPropagation();
    }
    this.showDaysHoursFilter = !this.showDaysHoursFilter;
  }



  init() {

    this.branchData = this.mapServices.sortedBranches;
    if (isNullOrUndefined(this.branchData)) {
      return;
    }
    this.branchNewArray = [];
    this.branchData.forEach(obj => {
      const branchFetched = this.branchDataServices.createSingleBranch(obj);
      this.branchNewArray.push(new BranchObj(branchFetched.isBankat, branchFetched.branchSummarize, branchFetched.branchService, branchFetched.fax,
        branchFetched.phone, branchFetched.branchManagerName, branchFetched.comment, branchFetched.servicesType));
    });
    //this.callQueryParam();
    this.branchNewArrayFilter = this.pipe.transform(this.branchNewArray, []);

  }

  updateBranchAfterChangeMap() {

    this.branchData = this.mapServices.sortedBranches;
    if (this.branchData.length) {
      this.init();
    }

  }
  addEvents(){

    this.events.on(CONSTANTS.EVENTS.UPDATE_BRANCH_FROM_MAP, () => {
      console.log('updated');
      this.updateBranchAfterChangeMap();
    }, true);
    this.events.on(CONSTANTS.EVENTS.UPDATE_FILTER, (filters) => {

      this.selectBranch(null);
      const activeFilter = this.branchFilterService.getActiveFilters();
      console.log('activeFilters !!!!!!', activeFilter);
      this.branchNewArrayFilter = this.pipe.transform(this.branchNewArray, activeFilter);
      this.handleFilterChange(activeFilter);


      // this.componentRef.directiveRef.ps().update();


    },true);
  }

  ngOnInit() {

    // this.city = this.route.snapshot.paramMap.get("city");
    this.addEvents();
    this.filters = this.branchFilterService.filters;
    this.branchData = this.mapServices.sortedBranches;
    this.init();



  }

  ngAfterViewInit() {
    //this.componentRef.directiveRef.ps().update();
    this.callQueryParam();
    interval(1000 * 60).subscribe(x => {
      this.init();

    })

  }


}
