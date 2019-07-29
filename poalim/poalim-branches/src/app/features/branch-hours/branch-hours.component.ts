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




  get dayName() {
console.log('select dat', this.branchFilter.selectedDays)
    return this.branchFilter.selectedDays;
  }

  ngOnInit() {


  }

}
