import { Pipe, PipeTransform } from '@angular/core';
import {BranchFilterService} from "../services/branch-filter.service";

@Pipe({
  name: 'FilterBranchPipe'


})
export class FilterBranchPipe implements PipeTransform {


  constructor(private branchFilter: BranchFilterService) {
  }

   filters: string[] =this.branchFilter.filters;


  transform(value: any, propName: number[]): any {
        console.log('activeFilters',propName);
debugger
    const doSomething=  propName.length;
     if (!doSomething) {
      return value;
    }

    const resultArray = [];
    for (const item of value) {
      if (item.branchSummarize.address.includes('ע')) {
        resultArray.push(item);
      }
    }
    return resultArray;
  }

}
