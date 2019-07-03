import { Injectable } from '@angular/core';
import {FilterBranch} from '../../core/models/filter-branch-model';

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
  private filters: any[]= [] ;
  private filterWithPics = this.ismobile?2:7;

  createFiltersByTipes() {
    let counter = 0;
    this.filtersTypes.forEach((value) => {
      this.filters.push(new FilterBranch( counter, value.type, '???', counter < this.filterWithPics, value.field , value.values, false))
      counter++;
    });

    return this.filters;
  }

  constructor() { }
}
