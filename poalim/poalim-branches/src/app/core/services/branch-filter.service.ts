import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {FunctionsService} from './functions.service';
import {FormControl, Validators} from '@angular/forms';

import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {MapBranchesService} from './map-branches.service';
import {AppService} from './app.service';


@Injectable({
  providedIn: 'root'
})
export class BranchFilterService {


  constructor(private functionsService: FunctionsService, private events: RcEventBusService, private  mapServices: MapBranchesService, private app: AppService) {
  }

  private filtersTypesArray: any[] = [];// convert to array for sorting
  filters: any[] = [];
  activeFilters: any[] = [];
  selectedHoursValue: string = '';
  selectedDaysValue: string = '';
  selectedBranchValue: any = '';
  selectedCityValue: any = '';
  dirty = false;

  set selectedHours(hours: string) {
    this.selectedHoursValue = hours;
  }

  set selectedDays(day: string) {

    this.selectedDaysValue = day;
  }

  get selectedDays() {

    return this.selectedDaysValue;
  }

  set selectedBranch(val) {

    this.selectedBranchValue = val;
  }

  set selectedCity(val: any) {
    this.selectedCityValue = val;
  }

  getActiveFilters() {
    return this.activeFilters;
  }

  updateActiveFilters(filters) {
    this.activeFilters = filters;
    this.events.emit(CONSTANTS.EVENTS.UPDATE_FILTER, filters);
  }

  /**
   * get array of filters from stub and add sort it
   * @param response Array get from service
   *   */
  createFiltersByTypes(response: any[]) {
    response.sort((a, b) => {
      return a - b;
    });
    this.filters = response;

  }

  handaleRemoveLocation() {
    this.mapServices.defaultFilter(this.app.branches);
  }

  handleAddLocation() {
    if (this.mapServices.hasLocationPermissionFromGeoLocation) {
      this.mapServices.changeFilterLoactionToTrue();
    } else {
      this.mapServices.getMyLocation().subscribe((res)=>{console.log('res',res)})

    }
  }

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
        this.events.emit(CONSTANTS.EVENTS.CLEAN_DROP_DOWN_HOURS); // that remove the day from friday because it clean specific day
        break;
      case CONSTANTS.FILTER_OPEN_FRIDAY :
        removeItem(CONSTANTS.FILTER_OPEN_NOW);
        removeItem(CONSTANTS.FILTER_BY_HOURS);
        removeItem(CONSTANTS.FILTER_BY_DAYS);
        this.events.emit(CONSTANTS.EVENTS.CLEAN_DROP_DOWN_HOURS);
        const valueToChange = this.activeFilters.indexOf(selectedFilters) === -1 ? CONSTANTS.FRIDAY : ''; // the opposite because the filter dont enter the array yet
        this.selectedDays = valueToChange;
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
    if ( indexOfId > -1) {
      this.activeFilters.splice(indexOfId, 1);
      if (id === CONSTANTS.FILTER_lOCATION ){
        this.handaleRemoveLocation();
      }
         } else {
      if (id === CONSTANTS.FILTER_lOCATION) {
        this.handleAddLocation();
      }

      this.activeFilters.push(id);
    }
    this.updateActiveFilters(this.activeFilters);

  }

  removeFilterCheckBoxValues(arr) {
    arr.forEach((val) => {
      const indexOfId = this.activeFilters.indexOf(val.key);
      if (indexOfId > -1) {
        this.activeFilters.splice(indexOfId, 1);

      }
    });
    this.updateActiveFilters(this.activeFilters);
  }

  removeFilterRadio(arr) {
    arr.forEach((val) => {
      const indexOfId = this.activeFilters.indexOf(val);
      if (indexOfId > -1) {
        this.activeFilters.splice(indexOfId, 1);

      }
    });
    this.updateActiveFilters(this.activeFilters);
  }

  addFiltersCheckBoxValues(arr) {
    arr.forEach((val) => {
      const indexOfId = this.activeFilters.indexOf(val.key);
      if (indexOfId == -1) {
        this.activeFilters.push(val.key);

      }
    });
    this.updateActiveFilters(this.activeFilters);
  }

  createCheckBoxArray(arr) {
    {
      let checkBoxValues = [];

      arr.forEach((val) => {
        checkBoxValues.push({key: val.serviceType, value: val.serviceLabel, formControl: new FormControl()});
      });
      return checkBoxValues;
    }
  }


}
