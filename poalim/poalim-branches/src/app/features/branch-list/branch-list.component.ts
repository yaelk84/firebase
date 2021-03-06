import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef,
  SimpleChange,
  OnChanges,
  SimpleChanges,
  ViewChildren, QueryList
} from '@angular/core';
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
import {DeviceService} from '../../core/services/event-service';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, AfterViewInit {

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild('buttonBackToResults') buttonBackToResults: ElementRef;
  @ViewChildren('itemList') itemList: QueryList<ElementRef>;
  @Input() branchNewArrayFilter: any;
  @Input() branchResultTitle: any;
  @Input() hideListInMoBile: boolean;
  // @Input() initGeneralMessages: any;


  public config: PerfectScrollbarConfigInterface = {};
  private city: string;

  filters = [];

  branchSelectedDisplay: object;
  showSelectedBranch = false;
  filterByDay = false;
  filterByHours = false;
  dayName = '';
  showDaysHoursFilter = false;
  filterWithHours = `${environment.imgUrlPath}hour-filter.svg`;
  filterWithNoHours = `${environment.imgUrlPath}no-filter-hours.svg`;
  showNoLocation = false;
  intervalTimer: any;
  isMobile = false;
  isTablet = false;
  filterIcon = this.filterWithNoHours;


  constructor(private branchDataServices: BranchDataService, private apiService: ApiService,
              private branchFilterService: BranchFilterService, private pipe: FilterBranchPipe, private events: RcEventBusService,
              private activeRoute: ActivatedRoute, private  mapServices: MapBranchesService, private  router: Router,
              private hours: HoursService, private appService: AppService, private deviceService: DeviceService) {
  }

  get generalMessage() {
    return this.appService.initGeneralMessages[0].messageIndependenceDay;
  }

  private branchData: any[];

  private buildFilterByQuery(queryParams) {
    this.showSelectedBranch = false;

    const updateData = () => {
      this.branchDataServices.isSingleDisplay = this.showSelectedBranch;
      this.branchDataServices.isShowSnazzyInfoWindow = this.showSelectedBranch;
      this.events.emit(CONSTANTS.EVENTS.SINGLE_DISPLY);
    };

    const handleCity = () => {

      const name = queryParams.branchName;
      const city = queryParams.city;
      const street = !isNullOrUndefined(queryParams.BranchStreet) ? queryParams.BranchStreet : '';
      const streetNumber = !isNullOrUndefined(queryParams.BranchStreetNumber) ? queryParams.BranchStreetNumber : '';
      const branches = this.appService.branches.filter((branch) => {
        // tslint:disable-next-line:max-line-length
        return (branch.geographicAddress[0].cityName === city && (!street.length || (String(branch.geographicAddress[0].streetName) === street)) && (!streetNumber.length || (String(branch.geographicAddress[0].buildingNumber) === streetNumber)));
      });
      if (this.mapServices.hasLocationPermissionFromGeoLocation) {

        this.mapServices.myLocationFilter(this.mapServices.position as GeoLocationObject, branches, false).subscribe((res) => {
          const branchesFilter = this.branchDataServices.createDataArray(this.mapServices.sortedBranches);
          showResultsCity(branchesFilter);
        });
      } else {
        this.mapServices.sortedBranches = branches;
        const branchesFilter = this.branchDataServices.createDataArray(this.mapServices.sortedBranches).slice(0, 10);
        showResultsCity(branchesFilter);
      }


    };
    const showResultsCity = (branchesFilter) => {
      this.branchDataServices.citySelected = queryParams.city;
      if (branchesFilter.length === 1) {
        singleCityResult(branchesFilter[0]);
        this.branchDataServices.initBranchesAndApplyFilters(branchesFilter, this.branchFilterService.activeFilters);

      } else {

        this.branchDataServices.initBranchesAndApplyFilters(branchesFilter, this.branchFilterService.activeFilters);
      }
      updateData();

    };

    const showError = () => {

    };
    const handleBranch = () => {

      const branchSelectedDisplay = getSingleBranch();
      if (isNullOrUndefined(branchSelectedDisplay)) {
        return;
      } else {
        this.branchDataServices.singleBranchToDisplay = branchSelectedDisplay;
        this.branchSelectedDisplay = branchSelectedDisplay;


        this.showSelectedBranch = true;
      }
    };
    const handleBranchName = () => {
      const branchSelectedDisplay = getSingleBranchName();
      if (isNullOrUndefined(branchSelectedDisplay)) {
        return;
      } else {
        this.branchSelectedDisplay = branchSelectedDisplay;
        this.showSelectedBranch = true;
      }
    };
    const singleCityResult = (branch) => {
      this.branchSelectedDisplay = branch;
      this.showSelectedBranch = true;
      this.branchDataServices.singleBranchToDisplay = branch;

    };
    const getSingleBranch = () => {
      let branchSelectedDisplay: any;
      const branchFromList = this.appService.branches;
      branchSelectedDisplay = branchFromList.filter((value) => {
        return queryParams.branch === String(value.branchNumber);
      })[0];
      if (!isNullOrUndefined(branchSelectedDisplay)) {
        branchSelectedDisplay.indexForDisplay = this.branchDataServices.indexNoBankat; // add the index
        return this.branchDataServices.createSingleBranch(branchSelectedDisplay);
      }

      return branchSelectedDisplay;
    };
    const getSingleBranchName = () => {

      let branchSelectedDisplay: any;
      const branchFromList = this.appService.branches;
      branchSelectedDisplay = branchFromList.filter((value) => {
        return queryParams.name === String(value.branchName);
      })[0];
      if (!isNullOrUndefined(branchSelectedDisplay)) {
        return this.branchDataServices.createSingleBranch(branchSelectedDisplay);
      }

      return branchSelectedDisplay;
    };

    if (!isNullOrUndefined(queryParams.branch && queryParams.branch.length)) {
      handleBranch();
    } else if (!isNullOrUndefined(queryParams.name && queryParams.name.length)) {
      handleBranchName();
    } else if (!isNullOrUndefined(queryParams.city && queryParams.city.length)) {
      handleCity();
      return;
    } else {
      if (!this.mapServices.hasLocationPermission) {
        this.mapServices.defaultFilter(this.appService.branches);
        this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices
          .createDataArray(this.mapServices.sortedBranches), this.branchFilterService.activeFilters);
      } else {
        this.mapServices.changeFilterLoactionToTrue();
        this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices
          .createDataArray(this.mapServices.sortedBranches), this.branchFilterService.activeFilters);

      }

    }
    updateData();
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
    this.showNoLocation = false;
  }

  backToResults() {
    const params = this.branchDataServices.citySelected.length ? {city: this.branchDataServices.citySelected} : {};
    this.router.navigate([], {queryParams: params, relativeTo: this.activeRoute});
    this.mapServices.isSearchHereButtonClicked = false;

  }

  selectBranch(id, index?) {
    const indexNoBankat = isNullOrUndefined(index) ? '' : index;
    this.branchDataServices.indexNoBankat = indexNoBankat;
    if (isNullOrUndefined(id)) {
      this.showSelectedBranch = false;
      const params = this.branchDataServices.citySelected.length ? {city: this.branchDataServices.citySelected} : {};
      this.router.navigate([], {queryParams: params, relativeTo: this.activeRoute});
    } else {
      this.router.navigate([], {queryParams: {branch: id}, relativeTo: this.activeRoute});
      setTimeout(() => {
        this.buttonBackToResults.nativeElement.focus();
      }, 100);
    }

  }

  handleFilterChange(activeFilter) {
    this.filterByHours = activeFilter.indexOf(CONSTANTS.FILTER_BY_HOURS) > -1;
    this.filterByDay = activeFilter.indexOf(CONSTANTS.FILTER_BY_DAYS) > -1;
    this.dayName = this.hours.selectedDays;

  }

  toggleDropDown(e) {
    // (!isNullOrUndefined(e) && Object.keys(e).length)
    if (!isNullOrUndefined(e)) {
      e.stopPropagation();
    }
    this.showDaysHoursFilter = !this.showDaysHoursFilter;
  }

  addEvents() {
    this.events.on(CONSTANTS.EVENTS.UPDATE_FILTER, (filters) => {
      if (this.showSelectedBranch && this.branchFilterService.dirty) {
        this.selectBranch(null);
      }
      const activeFilter = this.branchFilterService.getActiveFilters();
      this.handleFilterChange(activeFilter);

    }, true);
    this.events.on(CONSTANTS.EVENTS.OPEN_LOCATION_POPUP, () => {
      this.showNoLocation = true;
    }, true);


  }

  ngOnInit() {
    // this.city = this.route.snapshot.paramMap.get("city");
    this.addEvents();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isLg();
    this.filters = this.branchFilterService.filters;
    this.branchData = this.mapServices.sortedBranches;

  }

  /*ngOnChanges(changes: SimpleChanges) {
    if (changes.branchNewArrayFilter && !changes.branchNewArrayFilter.firstChange) {
      setTimeout(()=>{

        if (!isNullOrUndefined(this.itemList) && !isNullOrUndefined(this.itemList.first)) {
          this.itemList.first.nativeElement.focus();

        }
      },0)


    }

  }*/

  ngAfterViewInit() {
//

    this.callQueryParam();
    if (!this.mapServices.hasLocationPermissionFromGeoLocation) {
      this.showNoLocation = true;
    }
    this.intervalTimer = setInterval(() => {
      this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices.createDataArray(this.mapServices.sortedBranches),
        this.branchFilterService.activeFilters);
    }, 5000 * 60);
  }

  get imgSrc() {
    return `${environment.imgUrlPath}`;
  }
}
