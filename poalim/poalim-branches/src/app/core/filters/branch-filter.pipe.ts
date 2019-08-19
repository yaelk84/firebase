import {Pipe, PipeTransform} from '@angular/core';
import {BranchFilterService} from '../services/branch-filter.service';
import {angularCoreEnv} from '@angular/core/src/render3/jit/environment';
import {CONSTANTS} from '../../constants';

import {isNullOrUndefined} from 'util';
import {MapBranchesService} from '../services/map-branches.service';
import {AppService} from '../services/app.service';
import {HoursService} from '../services/hours.service';

@Pipe({
  name: 'FilterBranchPipe'


})
export class FilterBranchPipe implements PipeTransform {

  services(value, serviceType) {

    const  intVal = parseInt(serviceType);
    return value.serviceType.indexOf(intVal) > -1;
  }

  openFriday(value) {
    const friday = !isNullOrUndefined(value.branchSummarize.openAndCloseHours.dayInWeek.Friday.specificDayValue.morning) || value.isBankat;
    return friday;
  }

  openNow(value) {
    return value.branchSummarize.openAndCloseHours.openCurrentHours  || value.isBankat;
  }

  dayFunction(value) {

    const slectedDayInFilter = this.hours.selectedDaysValue;
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
    const slectedDayInFilter = this.hours.selectedDaysValue;
    const slectedHoursInFilter = this.hours.selectedHoursValue;
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

  constructor(private hours: HoursService , private mapService: MapBranchesService, private appService: AppService) {
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

          if(filters.indexOf( filter)  === -1 ){
            this.mapService.defaultFilter(this.appService.branches)
          }
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
    if (isNullOrUndefined(filters)) {

      matches = this.addIndexes(branches);
      return matches;
    }
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
