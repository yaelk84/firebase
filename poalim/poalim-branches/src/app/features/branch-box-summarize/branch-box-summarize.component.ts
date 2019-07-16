import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-branch-box-summarize',
  templateUrl: './branch-box-summarize.component.html',
  styleUrls: ['./branch-box-summarize.component.scss']
})
export class BranchBoxSummarizeComponent implements OnInit {
  openAndCloseHours;
  openHoursDrop = false;
  constructor() { }
  @Input() branchDataSummarize: any;
  @Input() isSingleDisplay: boolean;
  dropClick(){
    this.openHoursDrop =!this.openHoursDrop;
  }
  ngOnInit() {
    debugger
    this.openAndCloseHours = this.branchDataSummarize.openAndCloseHours;
  }

}
