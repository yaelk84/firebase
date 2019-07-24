import {Component, Input, OnInit} from '@angular/core';
import {HoursService} from '../../core/services/hours.service';

@Component({
  selector: 'app-branch-box-summarize',
  templateUrl: './branch-box-summarize.component.html',
  styleUrls: ['./branch-box-summarize.component.scss']
})
export class BranchBoxSummarizeComponent implements OnInit {
  hoursList: any[] = [];
  openAndCloseHours;
  openHoursDrop = false;
  constructor(private hoursFunc: HoursService) { }
  @Input() branchDataSummarize: any;
  @Input() isSingleDisplay: boolean;
  @Input()  filterByDay: boolean;
  closeDropDown(){
    this.openHoursDrop=false;
  }
  dropClick(e){
    e.stopPropagation();
    this.openHoursDrop =!this.openHoursDrop;
  }
  ngOnInit() {

    this.openAndCloseHours = this.branchDataSummarize.openAndCloseHours;
    this.hoursList = this.hoursFunc.creatHoursWeekList(this.openAndCloseHours);


     }

}
