import {Injectable} from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time-service';
import {AppService} from './app.service';
import {BranchHours} from '../interface/branch-hours';
import {isNullOrUndefined} from 'util';
import {BranchObj} from '../models/branch-model';
import {BranchSummarize} from '../models/branch-summarize-model';
import {HoursService} from './hours.service';


@Injectable({
  providedIn: 'root'
})
export class BranchDataService {
  private config = this.appService.appConfig;

  constructor(private translate: RcTranslateService, private timeService: TimeService, private appService: AppService, private hursService: HoursService) {
    const curTime = this.timeService.getCurrentTime();
    const dayName = this.timeService.getDayName(curTime);
    const tomarrowDay = this.timeService.addDays(1, curTime);
    const afterTomarrowDay = this.timeService.addDays(2, curTime);

  }

  private sortAndFilterArrayByDayMostCloseToCurrent(data, currentDay) {
    const cuurentDayObj = this.config.daysEn[currentDay];
    const filteredAndSortedData = data
      .filter((keyword) => {
        const dayObject = this.config.daysHe[keyword.field_bod_day];
        if (isNullOrUndefined(dayObject)) {
          return null;
        }
        let dayDifferent = (dayObject.index - cuurentDayObj.index);
        if (dayDifferent < 0) {
          dayDifferent = Math.abs(dayDifferent) + data.length;
        }

        keyword.dayDifferent = dayDifferent;
        return keyword;
      })
      .sort((a, b) => {
        return a.dayDifferent < b.dayDifferent ? -1 : 1;
      });
    ;
    return filteredAndSortedData;
  }

  private returnOpenHoursForCurrentDay(dayObject, currentTime, waasChange) {
    let hours = {morninigHours: '', nooonHours: ''};
    if (isNullOrUndefined(dayObject)) {
      return hours;
    }
    if (dayObject.field_bod_close_hour) {
      const currentHours = this.timeService.hoursDiff(currentTime, dayObject.field_bod_close_hour) > 0;
      if (currentHours) {
        hours.morninigHours = dayObject.field_bod_open_hours + '  - ' + dayObject.field_bod_close_hour;

      }
    }
    if (dayObject.field_bod_noon_close) {
      const currentHoursNoon = this.timeService.hoursDiff(currentTime, dayObject.field_bod_noon_close) > 0;
      if (currentHoursNoon) {
        hours.nooonHours = dayObject.field_bod_noon_open + ' - ' + dayObject.field_bod_noon_close;
      }
    }
    return hours;
  };

  private createOpeningAndClosingHours(dataObj, IsHourChange) {
    let objectHours: any = {};
    if (IsHourChange) {
      return objectHours;
    }
    const currentTime = this.timeService.getCurrentTime();
    const dayToCheck = this.timeService.getDayName(currentTime);
    const sortedFilterArray = this.sortAndFilterArrayByDayMostCloseToCurrent(dataObj, dayToCheck);
    for (let i = 0; i < sortedFilterArray.length; i++) {
      const openNow = sortedFilterArray[i].dayDifferent === 0;
      if (openNow) {
        const openAndCloseHours = this.returnOpenHoursForCurrentDay(sortedFilterArray[i], currentTime, false);
        if (openAndCloseHours.morninigHours) {
          objectHours = openAndCloseHours;
          objectHours.openNow = openNow;
          objectHours.changeHours = false;// todo
          break;

        }
      } else {
        objectHours.openAt = sortedFilterArray[i].field_bod_open_hours;
        if ( sortedFilterArray[i].dayDifferent === 1) {
          objectHours.tomorrow = true;
          objectHours.dayName=this.translate.getText('tomorrow');
        }
        else {
          objectHours.dayName = this.translate.getText(this.config.daysHe[sortedFilterArray[i].field_bod_day].en);
        }
        break;
      }

    }
    return objectHours;
  };
  private  replaceNullOrUndefinedInEmpty(val) {
    const  str = isNullOrUndefined(val) || val === 'null' ? '' : val;
    return str;
  }
  private  craeteBrancServices(services) {
        return services;
  }
  private  craeteContactAddress(contactAddress) {
    return {phone: contactAddress[0].contactAddressInfo,
            fax: contactAddress[1].contactAddressInfo};
  }
  createSingleBranch(data) {


    const hours: any = this.hursService.createOpeningAndClosingHours(data.availability.availabilityStandart.weekDaysSpecification , false , false);
    const address = data.geographicAddress[0];
    const contactAddress= this.craeteContactAddress(data.contactAddress);
    const branchData = {

      branchNum: data.branchNumber,
      branchName: data.branchName,
      address: this.replaceNullOrUndefinedInEmpty(address.cityName) + ' ' + this.replaceNullOrUndefinedInEmpty(address.streetName) + + this.replaceNullOrUndefinedInEmpty(address.streetName),
      distance: 0,
      openAndCloseHours: hours,
      branchCity: this.replaceNullOrUndefinedInEmpty(address.cityName),
      branchService:this.craeteBrancServices(data.branchService)
            };
      const branchSummarize = new BranchSummarize(branchData.branchNum, branchData.branchName, branchData.address,
      branchData.distance, branchData.openAndCloseHours);
      return{
        id: 1,
        branchSummarize: branchSummarize,
        branchService:  branchData.branchService,
        fax:  contactAddress.fax,
        phone:  contactAddress.phone,
        branchManagerName: data.branchManagerName,
        comment: data.comment
      };
  }


}


