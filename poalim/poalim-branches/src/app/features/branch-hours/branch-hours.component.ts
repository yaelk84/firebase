import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {HoursService} from '../../core/services/hours.service';
import {DeviceService} from '../../core/services/device.service';


@Component({
  selector: 'app-branch-hours',
  templateUrl: './branch-hours.component.html',
  styleUrls: ['./branch-hours.component.scss']
})
export class BranchHoursComponent implements OnInit {

  constructor(private translate: RcTranslateService, private  branchFilter: BranchFilterService, private hoursService: HoursService, private deviceService: DeviceService) {
  }

  @Input() hours: any;
  @Input() isSingleDisplay: boolean;
  @Output()togglePopup = new EventEmitter();
  isMobile = false;
  hoursList = [];
  openHoursDrop = false;

  closeDropDown() {
    this.openHoursDrop = false;
  }

  dropClick(e) {

    e.stopPropagation();

    this.togglePopup.emit();
  }

  get dayName() {
    return this.hoursService.selectedDays;
  }

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    ;
    this.hoursList = this.hoursService.creatHoursWeekList(this.hours);



  }

}
