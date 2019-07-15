import { Injectable } from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time-service';
import {AppService} from './app.service';
import {isNullOrUndefined} from 'util';
import {CONSTANTS} from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class HoursService {

  constructor(private translate: RcTranslateService, private timeService: TimeService, private appService: AppService) { }
  private  currentTime = this.timeService.getCurrentTime();
  private  order = { Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5, Friday: 6, Saturday: 7 };
  private curTime = this.timeService.getCurrentTime();
  private checkIfOpen(day) {
    if( day.branchOpeningHours && day.branchOpeningHours[0].startHour.length ||  day.branchOpeningHours[1].startHour.length ){
      return true;
    }
    return false

  }
 private  openNow(dayObject){
    debugger
    return this.timeService.hoursDiff(this.currentTime, dayObject.branchOpeningHours[0].endHour) > 0 ||
      this.timeService.hoursDiff(this.currentTime, dayObject.branchOpeningHours[0].endHour) > 0
 }
  private getOnlyOpendays( dataObj) {
    let onlyOpen: object = {};
    Object.keys(dataObj).forEach((key) => {
      debugger
      if(this.checkIfOpen(dataObj[key])) {
        onlyOpen[key] = dataObj[key];
      }
     });
    return onlyOpen;
  }
  private findNextOpenDay(openDays){
    let time;
    let dayToCheck = this.timeService.getDayName(this.currentTime);
    for (let i = 0; i < 100; i++) { //todo
       if (!isNullOrUndefined(openDays[dayToCheck].openToday) && !isNullOrUndefined(openDays[dayToCheck].openNow)) {
         return dayToCheck;
         break;
       } else {
         time = this.timeService.addDays(1, this.currentTime);
         dayToCheck = this.timeService.getDayName(time);

       }

    }


  }
  private addOpenHoursAndDays(dataObj){
    const dataObjWithData: object = {};
    Object.keys(dataObj).forEach((key) => {
      debugger
      if (this.checkIfOpen(dataObj[key])) {
        dataObjWithData[key].openToday = true;
      }
      if (this.openNow(dataObj[key])) {
        dataObjWithData[key].openNow = true;
      }
    });
    return dataObjWithData;
  }


  createOpeningAndClosingHours(dataObj){
    debugger

    const dayToCheck = this.timeService.getDayName(this.currentTime);
   // const onlyOpenDays = this.getOnlyOpendays(dataObj);
    const openHoursAndDays = this.addOpenHoursAndDays(dataObj);
    const nextOpenDay = this.findNextOpenDay(openHoursAndDays);


  }
}
