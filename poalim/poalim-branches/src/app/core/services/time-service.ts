import {Injectable} from '@angular/core';
import {RcTimeService} from '@realcommerce/rc-packages';

@Injectable({
  providedIn: 'root'
})
export class TimeService extends RcTimeService {
  private momentDateFormat = 'YYYY/MM/DD';
  private displayDefualtFormat = 'YYYYMMDD';

  constructor() {super(); }

  getCurrentTime() {
    return this.momentRef().format();
  }

  getDayName(date) {
    return this.momentRef(date).format('dddd');
  }

  addDays(amount: number, date: any) {
    return (this.momentRef(date).add(amount, 'days').toDate());
  }
  getHours(date) {
    return this.momentRef(date).format('H HH');
  }

  dateDiff(fromDate, toDate, type) {
    type = type ? type : 'minutes';
    const date1 = this.momentRef(fromDate, this.momentDateFormat);
    const date2 = this.momentRef(toDate, this.momentDateFormat);
    return date1.diff(date2, type, true);
  }

  dateFormat(date: any) {
    return this.momentRef(date).format(this.momentDateFormat);
  }

  isIBetween(date, start, end) {


    const startTime = this.momentRef(start, 'HH:mm');
    const endTime = this.momentRef(end, 'HH:mm');
    const aa =  startTime.diff(endTime, 'hours');
    console.log('aa', aa)
    const amIBetween = this.momentRef(date).isBetween(startTime , endTime);
    return amIBetween;   //  returns false.  if date ignored I expect TRUE


  }

  timeToDecimal(num) {
   return parseFloat(num.replace(':', '.'));
  }
  hoursDiff(date, end) {
    const startTime = this.momentRef(date).format('HH:mm');
    const diffNum = this.timeToDecimal(end) - this.timeToDecimal(startTime)
    return diffNum;
     }

}
