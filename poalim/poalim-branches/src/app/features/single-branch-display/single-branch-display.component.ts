import {Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {CONSTANTS} from '../../constants';
import {PerfectScrollbarModule, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-single-branch-display',
  templateUrl: './single-branch-display.component.html',
  styleUrls: ['./single-branch-display.component.scss']
})

export class SingleBranchDisplayComponent implements OnInit, AfterViewInit {
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild('phone') elementView: ElementRef;

  constructor() {
  }

  arrow = '/assets/media/left.svg';
  share = '/assets/media/share.svg';
  start = 0;
  end = CONSTANTS.SERVICES_NUM;
  openPopup = false;
  @ViewChild('tooltip') tooltip: ElementRef;
  openShareBranchPopup = false;
  @Input() indexNoBankat: string;
  @Input() dataBranchSelected: any;

  addMore() {
    this.end = this.dataBranchSelected.branchService.length;

  }

  createTempInput(val: string) {
    let selBox = document.createElement('input');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  copy(phone) {
    this.createTempInput('fffffffffff');


  }

  ngOnInit() {
    console.log('ddd', this.dataBranchSelected);

  }

  openReportproblem() {
    this.openPopup = true;
  }

  ngAfterViewInit() {

  }

}
