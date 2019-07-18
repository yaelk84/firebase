import {Component, OnInit} from '@angular/core';
import {CONSTANTS} from '../../constants';
import {BranchFilterService} from '../../core/services/branch-filter.service';

@Component({
  selector: 'app-hours-filer',
  templateUrl: './hours-filer.component.html',
  styleUrls: ['./hours-filer.component.scss']
})
export class HoursFilerComponent implements OnInit {
  selectedDay: string = '';
  selectedHours: string = '';
  hours: any = {
    noon: {star: CONSTANTS.NOON.START, end: CONSTANTS.NOON.END},
    morning: {star: CONSTANTS.MORNING.START, end: CONSTANTS.MORNING.END}
  };
  days: any[] = [{key: 'Sunday', label: 'א'}, {key: 'Monday', label: 'ב'}, {key: 'Tuesday', label: 'ג'}, {
    key: 'Wednesday', label: 'ד'
  }, {key: 'Thursday', label: 'ה'}, {key: 'Friday', label: 'ו'}, {key: 'Saturday', label: 'ז'}];


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
    this.filters.selectedHours = this.selectedHours;
    this.filters.selectedDays = this.selectedDay;
    this.filters.removeFilterRadio([CONSTANTS.FILTER_BY_HOURS, CONSTANTS.FILTER_BY_DAYS]);


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
    this.filters.selectedHours = this.selectedHours;
    this.filters.selectedDays = this.selectedDay;
    this.filters.removeFilterRadio([CONSTANTS.FILTER_BY_HOURS, CONSTANTS.FILTER_BY_DAYS]);


  }

  constructor(private filters: BranchFilterService) {
  }

  ngOnInit() {
  }

}
