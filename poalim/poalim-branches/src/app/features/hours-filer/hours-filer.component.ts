import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CONSTANTS} from '../../constants';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {HoursService} from '../../core/services/hours.service';

@Component({
  selector: 'app-hours-filer',
  templateUrl: './hours-filer.component.html',
  styleUrls: ['./hours-filer.component.scss']
})
export class HoursFilerComponent implements OnInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() close: EventEmitter<any> = new EventEmitter();
  selectedDay: string = '';
  selectedHours: string = '';
  hours: any = {
    noon: {star: CONSTANTS.NOON.START, end: CONSTANTS.NOON.END},
    morning: {star: CONSTANTS.MORNING.START, end: CONSTANTS.MORNING.END}
  };
  days: any[] = [{key: 'Sunday', label: 'א'}, {key: 'Monday', label: 'ב'}, {key: 'Tuesday', label: 'ג'}, {
    key: 'Wednesday', label: 'ד'
  }, {key: 'Thursday', label: 'ה'}, {key: 'Friday', label: 'ו'}];


  selectDay(day) {
    if (day.key === this.selectedDay) {
      this.selectedDay = '';
      return;
    }
    this.selectedDay = day.key;
  }

  selectHours(key) {
    if (key == this.selectedHours) {
      this.selectedHours ='';
      return;
    }
    this.selectedHours = key;
  }

  /**
   * on submit add type fileter to active filters( remove old first)
   * and update the selected  hours day value on service
   */
  submit() {
    this.hoursService.selectedHours = this.selectedHours;
    this.hoursService.selectedDays = this.selectedDay;
    this.filters.removeFilterRadio([CONSTANTS.FILTER_BY_HOURS, CONSTANTS.FILTER_BY_DAYS]);
    this.close.emit([]);
    if (this.selectedDay.length) {
      this.filters.toggleFilter(CONSTANTS.FILTER_BY_DAYS);
    }
    if (this.selectedHours.length) {
      this.filters.toggleFilter(CONSTANTS.FILTER_BY_HOURS);
    }
  }

  clear() {
    this.selectedDay = '';
    this.selectedHours = '';
    this.selectedHours = this.selectedHours;
    this.selectedDay = this.selectedDay;
    this.filters.removeFilterRadio([CONSTANTS.FILTER_BY_HOURS, CONSTANTS.FILTER_BY_DAYS]);
    this.close.emit([]);



  }

  constructor(private filters: BranchFilterService , private events: RcEventBusService, private hoursService: HoursService) {
  }

  ngOnInit() {
    this.events.on(CONSTANTS.EVENTS.CLEAN_DROP_DOWN_HOURS,()=>{
          this.clear();
    },true)
  }

}
