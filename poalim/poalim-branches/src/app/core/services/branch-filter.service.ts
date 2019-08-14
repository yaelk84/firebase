import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {FunctionsService} from './functions.service';
import {FormControl, Validators} from '@angular/forms';

import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {MapBranchesService} from './map-branches.service';
import {AppService} from './app.service';
import {BranchDataService} from './branch-data.service';
import {HoursService} from './hours.service';
import {GeoLocationObject} from '../interface/coordinates';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class BranchFilterService {


  constructor(private functionsService: FunctionsService, private events: RcEventBusService, private  mapServices: MapBranchesService, private app: AppService, private branchDataServices: BranchDataService, private hours: HoursService) {
  }

  private filtersTypesArray: any[] = []; // convert to array for sorting
  filters: any[] = [];
  activeFilters: any[] = [];
  selectedBranchValue: any = '';
  selectedCityValue: any = '';
  dirty = false;

  /** clear filters */
  clearFilter() {
    this.activeFilters = [];
  }

  /** get and set */
  set selectedCity(val: any) {
    this.selectedCityValue = val;
  }

  getActiveFilters() {
    return this.activeFilters;
  }

  /** set filters and event
   * @param filters Array
   */

  updateActiveFilters(filters) {
    this.activeFilters = filters;
    this.events.emit(CONSTANTS.EVENTS.UPDATE_FILTER, filters);
  }

  /**
   * get array of filters from stub and add sort it
   * @param response Array get from service
   */
  createFiltersByTypes(response: any[]) {
    response.sort((a, b) => {
      return a - b;
    });
    this.filters = response;

  }

  /**  user remove location by filter click */
  handaleRemoveLocation() {
    this.mapServices.hasLocationPermission = false;
    this.mapServices.defaultFilter(this.app.branches);
    this.branchDataServices.initBrnchesAndMap(this.branchDataServices.createDataArray(this.mapServices.sortedBranches));

  }

  /**  user add location by filter click */
  handleAddLocation() {
    const addLocation = new Observable((observer) => {
      this.branchDataServices.citySelected = '';
      this.events.emit(CONSTANTS.EVENTS.DELETE_SEARCH);
      if (this.mapServices.hasLocationPermissionFromGeoLocation) {
        this.mapServices.changeFilterLoactionToTrue();
        this.mapServices.hasLocationPermission = true;
        this.branchDataServices.initBrnchesAndMap(this.branchDataServices.createDataArray(this.mapServices.sortedBranches));
        observer.next(true);
      } else {
        this.mapServices.getMyLocation().subscribe((res) => {
          console.log('location');
          if (!isNullOrUndefined(res as GeoLocationObject).lat) {
            this.mapServices.myLocationFilter((res as GeoLocationObject), this.app.branches).subscribe(() => {
              const branchesFilter = this.branchDataServices.createDataArray(this.mapServices.sortedBranches);
              this.branchDataServices.initBranchesAndApplyFilters(branchesFilter, this.activeFilters);
              observer.next(true);
            });
          }
        }, (error: any) => {
          observer.next(false);
          console.log('emit')
          this.events.emit(CONSTANTS.EVENTS.OPEN_LOCATION_POPUP);
          const branchesFilter = this.branchDataServices.createDataArray(this.mapServices.defaultFilter(this.app.branches));
          this.branchDataServices.initBranchesAndApplyFilters(branchesFilter, this.activeFilters);
          return throwError(error);
        });

      }
    });
    return addLocation;

  }

  /**  remove filter that can not go together nad update activeFilters array
   * @param selectedFilters Array
   */
  removeOtherFiltersIfOnlyOneFilterCanSelected(selectedFilters) {

    const removeItem = (id) => {
      const indexOfId = this.activeFilters.indexOf(id);
      if (indexOfId > -1) {
        this.activeFilters.splice(indexOfId, 1);

      }
    };
    switch (selectedFilters) {
      case CONSTANTS.FILTER_OPEN_NOW :
        removeItem(CONSTANTS.FILTER_OPEN_FRIDAY);
        removeItem(CONSTANTS.FILTER_BY_HOURS);
        removeItem(CONSTANTS.FILTER_BY_DAYS);
        this.hours.selectedDays = '';
        this.events.emit(CONSTANTS.EVENTS.CLEAN_DROP_DOWN_HOURS); // that remove the day from friday because it clean specific day
        break;
      case CONSTANTS.FILTER_OPEN_FRIDAY :
        removeItem(CONSTANTS.FILTER_OPEN_NOW);
        removeItem(CONSTANTS.FILTER_BY_HOURS);
        removeItem(CONSTANTS.FILTER_BY_DAYS);
        this.events.emit(CONSTANTS.EVENTS.CLEAN_DROP_DOWN_HOURS);
        const valueToChange = this.activeFilters.indexOf(selectedFilters) === -1 ? CONSTANTS.FRIDAY : ''; // the opposite because the filter dont enter the array yet
        this.hours.selectedDays = valueToChange;
        break;
      case CONSTANTS.FILTER_BY_DAYS :
        removeItem(CONSTANTS.FILTER_OPEN_NOW);
        removeItem(CONSTANTS.FILTER_OPEN_FRIDAY);
        break;
      case CONSTANTS.FILTER_BY_HOURS :
        removeItem(CONSTANTS.FILTER_OPEN_NOW);
        removeItem(CONSTANTS.FILTER_OPEN_FRIDAY);
        break;

    }

  }

  toggleFilter(id: any, defualtVal?) {

    if (isNullOrUndefined(defualtVal)) {
      this.dirty = true;
    }
    this.removeOtherFiltersIfOnlyOneFilterCanSelected(id);
    const indexOfId = this.activeFilters.indexOf(id);
    if (indexOfId > -1) {
      this.activeFilters.splice(indexOfId, 1);
      if (id === CONSTANTS.FILTER_lOCATION) {
        this.handaleRemoveLocation();
      }
      this.updateActiveFilters(this.activeFilters);
    } else {
      const canAddLocation = false;
      if (id === CONSTANTS.FILTER_lOCATION) {
        this.handleAddLocation().subscribe((canAddLoation) => {
          if (canAddLoation) {
            this.activeFilters.push(id);
          }

          this.updateActiveFilters(this.activeFilters);
        });
      } else {
        this.activeFilters.push(id);
        this.updateActiveFilters(this.activeFilters);
      }


    }


  }

  /** remove filters from drop down list after apply
   * @param arr Array to delete */
  removeFilterCheckBoxValues(arr) {
    arr.forEach((val) => {
      const indexOfId = this.activeFilters.indexOf(val.key);
      if (indexOfId > -1) {
        this.activeFilters.splice(indexOfId, 1);

      }
    });
    this.updateActiveFilters(this.activeFilters);
  }

  /** remove filters from filters
   * @param arr Array to delete */
  removeFilterRadio(arr) {
    arr.forEach((val) => {
      const indexOfId = this.activeFilters.indexOf(val);
      if (indexOfId > -1) {
        this.activeFilters.splice(indexOfId, 1);

      }
    });
    this.updateActiveFilters(this.activeFilters);
  }

  /** add multi vals
   * @param arr Array to add */
  addFiltersCheckBoxValues(arr) {
    arr.forEach((val) => {
      const indexOfId = this.activeFilters.indexOf(val.key);
      if (indexOfId == -1) {
        this.activeFilters.push(val.key);

      }
    });
    this.updateActiveFilters(this.activeFilters);
  }

  /** create the drop down array
   * @param arr Array to add */
  createCheckBoxArray(arr) {
    {
      const checkBoxValues = [];

      arr.forEach((val) => {
        checkBoxValues.push({key: val.serviceType, value: val.serviceLabel, formControl: new FormControl()});
      });
      return checkBoxValues;
    }
  }


}
