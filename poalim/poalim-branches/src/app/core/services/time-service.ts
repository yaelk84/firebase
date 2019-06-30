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

  dateDiff(fromDate, toDate, type) {
    type = type ? type : 'minutes';
    const date1 = this.momentRef(fromDate, this.momentDateFormat);
    const date2 = this.momentRef(toDate, this.momentDateFormat);
    return date1.diff(date2, type, true);
  }

  dateFormat(date: any) {
    return this.momentRef(date).format(this.momentDateFormat);
  }
}
