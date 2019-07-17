import { Pipe, PipeTransform } from '@angular/core';
import {BranchFilterService} from "../services/branch-filter.service";
import {angularCoreEnv} from '@angular/core/src/render3/jit/environment';

import {isNullOrUndefined} from 'util';

@Pipe({
  name: 'FilterBranchPipe'


})
export class FilterBranchPipe implements PipeTransform {

  dayFunction(value){
    const slectedDayInFilter =  this.branchFilter.selectedDaysValue;
    const results = [];
    value.forEach((item) => {
      if (!isNullOrUndefined(item.branchSummarize.openAndCloseHours.dayInWeek[slectedDayInFilter]) && item.branchSummarize.openAndCloseHours.dayInWeek[slectedDayInFilter].openToday ){
        results.push(item)
      }
    })
    return results;
    
  }

  filterDataByFilter(id ,value){
   switch (id) {
     case '202' :
     return this.dayFunction(value)
       break;
     default:
       


     
   }
   
 }
  constructor(private branchFilter: BranchFilterService) {
  }

   filters: string[] =this.branchFilter.filters;

  transform(value: any, propName: number[]): any {

    let resultArray = [];
    propName.forEach((filter) => {
debugger
      resultArray = this.filterDataByFilter(filter , value);



    })



    return resultArray;
  }

}
