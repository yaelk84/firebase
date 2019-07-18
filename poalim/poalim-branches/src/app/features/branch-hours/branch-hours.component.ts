import {Component, Input, OnInit} from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {BranchFilterService} from '../../core/services/branch-filter.service';



@Component({
  selector: 'app-branch-hours',
  templateUrl: './branch-hours.component.html',
  styleUrls: ['./branch-hours.component.scss']
})
export class BranchHoursComponent implements OnInit {

  constructor(private translate: RcTranslateService ,private  branchFilter: BranchFilterService) { }
  @Input() hours: any;
  @Input() isSingleDisplay: boolean;
  @Input() filterByDay: boolean

  get dayName() {
    return this.branchFilter.selectedDays;
  }

  ngOnInit() {
console.log('dayName' , this.dayName )

  }

}
