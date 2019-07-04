import { Injectable } from '@angular/core';
import {FilterBranch} from "../models/filter-branch-model";
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BranchFilterService {

  private ismobile = false;//todo;
  private filtersTypes = [ {type: '1', field: '' , values: []},
                                  {type: '10', field: '' , values: []},
                                  {type: '14', field: '' , values: []},
                                  {type: '8', field: '' , values: []},
                                  {type: '16', field: '' , values: []},
                                  {type: '13', field: '' , values: []},
                                  {type: '15', field: '' , values: []},
                                  {type: '4', field: '' , values: []},
                                  {type: 'around', field: '' ,values: []},
                                  {type: 'open-now', field: '' , values: []},
                                  {type: 'open-friday', field: '' , values: []}];
  filters: any[]= [] ;
 filterWithPics = this.ismobile?2:7;

  private activeFilter: BehaviorSubject<number []> = new BehaviorSubject<number [] >([]);
  activeFilters$  = this.activeFilter.asObservable();
  activeFilters: number[]=new Array();


  updateActiveFilters(filters){
   this.activeFilters$=filters;
   this.activeFilters=filters;
    this.activeFilter.next(filters);
 }
  createFiltersByTiypes() {
    let counter = 0;
    this.filtersTypes.forEach((value) => {
      this.filters.push(new FilterBranch( counter, value.type, '???', counter < this.filterWithPics, value.field , value.values, false))
      counter++;
    });

    return this.filters;
  }
  toggleFilter(id:number) {
debugger;
      const indexOfId = this.activeFilters.indexOf(id)
    if ( indexOfId > -1) {
      this.activeFilters.splice(indexOfId, 1);

    }
    else {

      this.activeFilters.push(id)
    }
    this.updateActiveFilters(this.activeFilters)

  }


  constructor() { }
}
