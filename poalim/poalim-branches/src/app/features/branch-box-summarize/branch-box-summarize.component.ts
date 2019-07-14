import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-branch-box-summarize',
  templateUrl: './branch-box-summarize.component.html',
  styleUrls: ['./branch-box-summarize.component.scss']
})
export class BranchBoxSummarizeComponent implements OnInit {
  openAndCloseHours;
  constructor() { }
  @Input() branchDataSummarize: any;
  ngOnInit() {
    this.openAndCloseHours = this.branchDataSummarize.openAndCloseHours;
  }

}
