import { Injectable } from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time-service';
import {AppService} from './app.service';
import {BranchHours} from '../interface/branch-hours';
import {isNullOrUndefined} from 'util';




@Injectable({
  providedIn: 'root'
})
export class BranchDataService {
  private config = this.appService.appConfig;
  constructor(private translate: RcTranslateService, private timeService: TimeService, private appService: AppService  ) {
    const curTime = this.timeService.getCurrentTime();
    const dayName = this.timeService.getDayName(curTime);
    const  tomarrowDay = this.timeService.addDays(1, curTime);
    const  afterTomarrowDay = this.timeService.addDays(2, curTime);

  }
  private returnOpenHoursForSpecificDay(dayObject, currentTime ,IshourChange) {
   let hours: string = '';
   if (isNullOrUndefined(dayObject)) {
     return hours;
   }
   const currentHours = this.timeService.isIBetween(currentTime, dayObject.field_bod_open_hours, dayObject.field_bod_close_hour);
   if (currentHours) {
     hours = dayObject.field_bod_open_hours + ' ' + dayObject.field_bod_close_hour;
   }
   const currentHoursNoon = this.timeService.isIBetween(currentTime, dayObject.field_bod_noon_open, dayObject.field_bod_noon_close);
   if (currentHoursNoon) {
     hours += dayObject.field_bod_noon_open + ' ' +  dayObject.field_bod_noon_close;
   }
   return hours;

  }
  private convertHoursArrayToObjectByDay(data: any) {
    let daysObject :any={};
    data.forEach(obj => {
      const key = this.config.daysHe[obj.field_bod_day];
        daysObject[key] = obj;
    });
    return daysObject;
   };
  private createOpeningAndClosingHours(dataObj, IsHourChange): BranchHours {
        let objectHours = {hours: '' , openNow: false , changeHours: IsHourChange};
        if (IsHourChange) {
          return  objectHours;
        }
        const currentTime = this.timeService.getCurrentTime();
        const dayArrayLength = dataObj.length;//todo
        const daysObject = this.convertHoursArrayToObjectByDay(dataObj);
        for (let i = 0; i < dayArrayLength; i++) {
          const dayToCheck = this.timeService.getDayName(this.timeService.addDays(i, currentTime));
          objectHours.hours = this.returnOpenHoursForSpecificDay(daysObject[dayToCheck], currentTime ,  dataObj.wasChange);
          if ( objectHours.hours) {
            if (i === 0) {
              objectHours.openNow = true;
            }
            break;
          }
        }

        return objectHours;
  }

  createSingleBranch(data) {
    const  hours: BranchHours  = this.createOpeningAndClosingHours(data.field_branch_open_days,false);
    debugger
      return{id: 1,
      branchNum: data.field_branch_num,
      branchName: data.field_branch_latlon,
      address:data.name+" "+data.field_branch_street,
      distance:0,
      openAndCloseHours: hours.hours,
      openNow: hours.openNow,
      change:  hours.changeHours};
  }



}


