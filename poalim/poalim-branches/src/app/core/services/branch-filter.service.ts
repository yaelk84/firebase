import {Injectable} from '@angular/core';
import {FilterBranch} from '../models/filter-branch-model';
import {BehaviorSubject} from 'rxjs';
import {FunctionsService} from './functions.service';
import {FormControl, Validators} from '@angular/forms';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';



@Injectable({
  providedIn: 'root'
})
export class BranchFilterService {



  constructor(private functionsService: FunctionsService, private events: RcEventBusService) {
  }
  private filtersTypes = // use object type for easy pipe
    {
      around: {field: '', values: [], id: 0, text: '??????'},
      'open-now': {field: '', values: [], id: 1 , text: '??????'},
      'open-friday': {field: '', values: [], id: 2, text: '??????'},
      1: {field: '', values: [], id: 3 , text: '??????'},
      10: {field: '', values: [], id: 4,  text: '??????'},
      14: {field: '', values: [], id: 5 , text: '??????'},
      8: {field: '', values: [], id: 6 , text: '??????'},
      16: {field: '', values: [], id: 7 , text: '??????'},
      13: {field: '', values: [], id: 8,  text: '??????'},
      15: {field: '', values: [], id: 9 , text: '??????'},
      4: {field: '', values: [], id: 10,  text: '??????'}
    };
  private filtersTypesArray: any[] = []; // convert to array for sorting
  filters: any[] = [];
  activeFilters: number[] = [];
  public getActiveFilters() {
    return this.activeFilters;
  }
  updateActiveFilters(filters) {
    this.activeFilters = filters;
    this.events.emit(CONSTANTS.EVENTS.UPDATE_FILTER, filters);
  }
  createFiltersByTypes() {
    this.filtersTypesArray = this.functionsService.sortArrayByKey(
      this.functionsService.convertObjToArray(this.filtersTypes, 'type'), 'id', false);
    this.filtersTypesArray.forEach((value) => {
      this.filters.push(new FilterBranch(value.id, value.type, value.text, value.field, value.values));
    });
    return this.filters;
  }
  toggleFilter(id: number) {

    const indexOfId = this.activeFilters.indexOf(id);
    if (indexOfId > -1) {
      this.activeFilters.splice(indexOfId, 1);

    } else {

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
      const checkBoxValues: any[] = [];

      arr.forEach((val) => {
        checkBoxValues.push({key: val.type, value: val.text, isCheck: false, formControl: new FormControl()});
      });
      return checkBoxValues;
    }
  }


}
