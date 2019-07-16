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
  start = 0;
  end = CONSTANTS.SERVICES_NUM;
  @Input() dataBranchSelected: any;
  @Input() selectedIndex: number;
  addMore(){
    this.end = this.dataBranchSelected.branchService.length;

  }

  ngOnInit() {


  }

}
