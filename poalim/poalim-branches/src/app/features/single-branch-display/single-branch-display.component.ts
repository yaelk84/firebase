import {Component, Input, OnInit} from '@angular/core';
import {CONSTANTS} from '../../constants';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-single-branch-display',
  templateUrl: './single-branch-display.component.html',
  styleUrls: ['./single-branch-display.component.scss']
})
export class SingleBranchDisplayComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {}
  constructor() { }
  arrow =  '/assets/media/left.svg';
  start = 0;
  end = CONSTANTS.SERVICES_NUM;
  openPopup = false;
  @Input() dataBranchSelected: any;
   addMore(){
    this.end = this.dataBranchSelected.branchService.length;

  }

  ngOnInit() {


  }
  openReportproblem(){
    this.openPopup = true;
  }

}
