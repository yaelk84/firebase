import { Pipe, PipeTransform } from '@angular/core';
import {BranchFilterService} from "../services/branch-filter.service";

@Pipe({
  name: 'FilterBranchPipe',
  pure: false
})
export class FilterBranchPipe implements PipeTransform {


  constructor(private branchFilter: BranchFilterService) {
  }

   filters: any[] =this.branchFilter.filters;
   activeFilters: any[]=this.branchFilter.activeFilters;

  transform(value: any, propName: string): any {
    debugger

    const filterString=  propName.length? 'ddd': 'rrr';
     if (value.length === 0 ) {
      return value;
    }

    const resultArray = [];
    for (const item of value) {
      if (item[propName] === filterString) {
        resultArray.push(item);
      }
    }
    return resultArray;
  }

}
