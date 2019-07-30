import {Pipe, PipeTransform} from '@angular/core';
import {BranchFilterService} from '../services/branch-filter.service';
import {angularCoreEnv} from '@angular/core/src/render3/jit/environment';
import {CONSTANTS} from '../../constants';

import {isNullOrUndefined} from 'util';

@Pipe({
  name: 'FilterBranchPipe'


})
export class FilterBranchPipe implements PipeTransform {

  services(value, serviceType) {
    return value.serviceType.indexOf(serviceType) > -1;
  }

  openFriday(value) {
    return !isNullOrUndefined(value.branchSummarize.openAndCloseHours.dayInWeek.Friday.morning) || !isNullOrUndefined(value.branchSummarize.openAndCloseHours.dayInWeek.Friday.morning);
  }

  openNow(value) {
    return value.branchSummarize.openAndCloseHours.openCurrentHours;
  }

  dayFunction(value) {

    const slectedDayInFilter = this.branchFilter.selectedDaysValue;
    return (!isNullOrUndefined(value.branchSummarize.openAndCloseHours.dayInWeek[slectedDayInFilter]) && value.branchSummarize.openAndCloseHours.dayInWeek[slectedDayInFilter].openToday);
  }

  addIndexes(matches) {
    let newMatches = [];
    let conunter = 1;
    matches.forEach((value) => {
      if (!value.isBankat) {
        value.indexNoBankat = conunter;
        conunter++;
      }
      newMatches.push(value);

    });
    return newMatches;
  }

  hoursFunction(value) {
    const slectedDayInFilter = this.branchFilter.selectedDaysValue;
    const slectedHoursInFilter = this.branchFilter.selectedHoursValue;
    const dayInWeek = isNullOrUndefined(value.branchSummarize.openAndCloseHours.dayInWeek) ? {} : value.branchSummarize.openAndCloseHours.dayInWeek;
    if (slectedDayInFilter.length) { /*choose day and hours*/
      return !isNullOrUndefined(dayInWeek[slectedDayInFilter][slectedHoursInFilter]);
    } else {
      const banchOpensByHours = Object.keys(dayInWeek).filter((key) => {
        return !isNullOrUndefined(dayInWeek[key][slectedHoursInFilter]);
      });
      return banchOpensByHours.length > 0;
    }

  }

  constructor(private branchFilter: BranchFilterService) {
  }

  transform(branches: any, filters: number[]): any {

    let matches: any[] = branches;
    const checkSpecificFilter = (values, filter) => {
      switch (filter) {
        case CONSTANTS.FILTER_BY_DAYS :
          return this.dayFunction(values);
          break;
        case CONSTANTS.FILTER_BY_HOURS :
          return this.hoursFunction(values);
          break;
        case CONSTANTS.FILTER_OPEN_NOW :
          return this.openNow(values);
          break;
        case CONSTANTS.FILTER_OPEN_FRIDAY :
          return this.openFriday(values);
          break;
        case CONSTANTS.FILTER_lOCATION :
          return values;
          break;
        default:
          return this.services(values, filter);
          break;

      }
    };
    const filterBranchesBySingleFilter = (filter: any) => {
      const fileredBranches = [];
      for (let n = 0; n < matches.length; n++) {
        if (checkSpecificFilter(matches[n], filter)) {
          fileredBranches.push(matches[n]);
        }
      }
      return fileredBranches;
    };
    if (!filters.length) {

      matches = this.addIndexes(branches);
      return matches;
    }
    // Loop through each item in the filters
    for (let i = 0; i < filters.length; i++) {
      matches = filterBranchesBySingleFilter(filters[i]);

    }

    matches = this.addIndexes(matches);
    return matches;
  }

}
