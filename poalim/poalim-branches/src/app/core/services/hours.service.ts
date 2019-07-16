import {Injectable} from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time-service';
import {AppService} from './app.service';
import {isNullOrUndefined} from 'util';

import {CONSTANTS} from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class HoursService {

  constructor(private timeService: TimeService, private appService: AppService, private translate: RcTranslateService) {
  }

  private currentTime = this.timeService.getCurrentTime();
  private order = {Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5, Friday: 6, Saturday: 7};
  private curTime = this.timeService.getCurrentTime();

  private openInMorninig(obj) {
    return (!isNullOrUndefined(obj.branchOpeningHours[0].startHour)) && obj.branchOpeningHours[0].startHour.length;
  }

  private openInNoon(obj) {
    return (!isNullOrUndefined(obj.branchOpeningHours[1].startHour)) && obj.branchOpeningHours[1].startHour.length;
  }

  private checkIfOpen(day) {
    if (day.branchOpeningHours && day.branchOpeningHours[0].startHour.length || day.branchOpeningHours[1].startHour.length) {
      return true;
    }
    return false;

  }

  private openNow(dayObject) {

    return this.timeService.hoursDiff(this.currentTime, dayObject.branchOpeningHours[0].endHour) > 0 ||
      this.timeService.hoursDiff(this.currentTime, dayObject.branchOpeningHours[0].endHour) > 0;
  }

  private getOnlyOpendays(dataObj) {
    let onlyOpen: object = {};
    Object.keys(dataObj).forEach((key) => {

      if (this.checkIfOpen(dataObj[key])) {
        onlyOpen[key] = dataObj[key];
      }
    });
    return onlyOpen;
  }

  private findNextOpenDay(dataObj) {
    let time;
    let dayToCheck = this.timeService.getDayName(this.currentTime);
    for (let i = 0; i < 100; i++) { //todo
      if (!isNullOrUndefined(dataObj.dayInWeek[dayToCheck].openToday) && !isNullOrUndefined(dataObj.dayInWeek[dayToCheck].openNow)) {
        dataObj.closestOpenDay = dayToCheck;
        if (i === 0) {
          dataObj.openCurrentDay = true;
        } else if (i === 1) {
          dataObj.openCurrentTomorrow = true;
        }

        break;
      } else {
        time = this.timeService.addDays(1, this.currentTime);
        dayToCheck = this.timeService.getDayName(time);

      }

    }

    return dataObj;
  }

  private addOpenHoursAndDays(dataObj) {
    const dataObjWithData: any = {dayInWeek:{}};

    Object.keys(dataObj).forEach((key) => {
        dataObjWithData.dayInWeek[key] = {};
        if (this.checkIfOpen(dataObj[key])) {
          dataObjWithData.dayInWeek[key].openToday = true;
          if (this.openNow(dataObj[key])) {
            dataObjWithData.dayInWeek[key].openNow = true;
          }
        }
        if (this.openInMorninig(dataObj[key])) {
          dataObjWithData.dayInWeek[key].morning = dataObj[key].branchOpeningHours[0];
        }
        if (this.openInNoon(dataObj[key])) {
          dataObjWithData.dayInWeek[key].noon = dataObj[key].branchOpeningHours[1];
        }
      }
    );
    return dataObjWithData;
  }

  private openAt(currLabel) {
    if (!isNullOrUndefined(currLabel.morning)) {
      return currLabel.morning.startHour;

    }
    return currLabel.noon.startHour;
  }

  private createLable(dataObj) {
    let label: any = {};
    const currLabel = dataObj.dayInWeek[dataObj.closestOpenDay];
    if (dataObj.openCurrentDay) {
      if (currLabel.morning) {
        label.morning = currLabel.morning.startHour + '-' + currLabel.morning.endHour;
      }
      if (currLabel.noon) {
        label.morning = currLabel.noon.startHour + '-' + currLabel.noon.endHour;
      }


    } else if (dataObj.openCurrentTomorrow) {


      label.textHours = this.translate.getText('openTomarrow', [this.openAt(currLabel)]);
    } else {
      label.textHours = this.translate.getText('openAnotherDay', [dataObj.closestOpenDay, this.openAt(currLabel)]);
    }
    return label;

  }


  createOpeningAndClosingHours(dataObj, waschange, isBankat) {

    const dayToCheck = this.timeService.getDayName(this.currentTime);
    // const onlyOpenDays = this.getOnlyOpendays(dataObj);
    let openHoursAndDays: any = this.addOpenHoursAndDays(dataObj);
    if (waschange) {
      openHoursAndDays.wasChange = true;
    }
    if (isBankat) {
      openHoursAndDays.isBankat = true;
    }
    openHoursAndDays = this.findNextOpenDay(openHoursAndDays);

    openHoursAndDays.label = this.createLable(openHoursAndDays);

    return openHoursAndDays;
      ;

  }

  creatHoursWeekList(dataObj){
console.log('hour',dataObj);

  }
}
