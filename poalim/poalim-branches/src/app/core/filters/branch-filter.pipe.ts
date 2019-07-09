import { Pipe, PipeTransform } from '@angular/core';
import {BranchFilterService} from "../services/branch-filter.service";

@Pipe({
  name: 'FilterBranchPipe',
  pure :false

})
export class FilterBranchPipe implements PipeTransform {


  constructor(private branchFilter: BranchFilterService) {
  }

   filters: string[] =this.branchFilter.filters;


  transform(value: any, propName: number[]): any {
        console.log('activeFilters',propName);

    const filterString=  propName.length? 'ddd': 'rrr';
     if (value.length === 0 ) {
      return value;
    }

    const resultArray = [];
   /* for (const item of value) {
      if (propName.length) === filterString) {
        resultArray.push(item);
      }
    }*/
    return resultArray;
  }

}
