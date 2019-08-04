import {Component, Input, OnInit} from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {HoursService} from '../../core/services/hours.service';



@Component({
  selector: 'app-branch-hours',
  templateUrl: './branch-hours.component.html',
  styleUrls: ['./branch-hours.component.scss']
})
export class BranchHoursComponent implements OnInit {

  constructor(private translate: RcTranslateService ,private  branchFilter: BranchFilterService , private hoursService: HoursService) { }
  @Input() hours: any;
  @Input() isSingleDisplay: boolean;




  get dayName() {
    return this.hoursService.selectedDays;
  }

  ngOnInit() {


  }

}
