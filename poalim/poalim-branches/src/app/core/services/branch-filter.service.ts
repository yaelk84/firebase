import {Injectable} from '@angular/core';
import {FilterBranch} from "../models/filter-branch-model";
import {FunctionsService} from "./functions.service";
import {FormControl, Validators} from "@angular/forms";

import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';



@Injectable({
  providedIn: 'root'
})
export class BranchFilterService {



  constructor(private functionsService: FunctionsService, private events: RcEventBusService) {
  }

  private filtersTypesArray: any[] = [] ;// convert to array for sorting
  filters: any[] = [];
  activeFilters: any[] = [];
  selectedHoursValue: string ='';
  selectedDaysValue:  string = '';

  set selectedHours(hours: string) {
    this.selectedHoursValue = hours;
  }
  set  selectedDays(day: string) {

    this.selectedDaysValue = day;
  }
  get selectedDays() {

    return  this.selectedDaysValue;
  }





  getActiveFilters() {
    return this.activeFilters;
  }

  updateActiveFilters(filters) {
    this.activeFilters = filters;
    this.events.emit(CONSTANTS.EVENTS.UPDATE_FILTER,filters)
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

  toggleFilter(id: any) {

    const indexOfId = this.activeFilters.indexOf(id)
    if (indexOfId > -1) {
      this.activeFilters.splice(indexOfId, 1);

    } else {

      this.activeFilters.push(id)
    }
    this.updateActiveFilters(this.activeFilters)

  }
  removeFilterCheckBoxValues(arr){
     arr.forEach((val)=>{
       const indexOfId = this.activeFilters.indexOf(val.key)
       if (indexOfId > -1) {
         this.activeFilters.splice(indexOfId, 1);

       }
     })
    this.updateActiveFilters(this.activeFilters);
  }
  removeFilterRadio(arr){
    arr.forEach((val)=>{
      const indexOfId = this.activeFilters.indexOf(val)
      if (indexOfId > -1) {
        this.activeFilters.splice(indexOfId, 1);

      }
    })
    this.updateActiveFilters(this.activeFilters);
  }
  addFiltersCheckBoxValues(arr){
    arr.forEach((val)=>{
      const indexOfId = this.activeFilters.indexOf(val.key)
      if (indexOfId == -1) {
        this.activeFilters.push(val.key);

      }
    })
    this.updateActiveFilters(this.activeFilters);
  }
  createCheckBoxArray(arr){
    {
      let checkBoxValues = [];

      arr.forEach((val)=>{
        checkBoxValues.push({key: val.serviceType, value: val.serviceLabel, formControl: new FormControl()});
      })
      return checkBoxValues;
    }
  }


}
