import {Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {CONSTANTS} from '../../constants';
import {PerfectScrollbarModule, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {BranchDataService} from '../../core/services/branch-data.service';

@Component({
  selector: 'app-single-branch-display',
  templateUrl: './single-branch-display.component.html',
  styleUrls: ['./single-branch-display.component.scss']
})

export class SingleBranchDisplayComponent implements OnInit, AfterViewInit {
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild('phone') elementView: ElementRef;

  constructor(private dataBranchServices: BranchDataService) {
  }

  arrow = '/assets/media/left.svg';
  share = '/assets/media/share.svg';
  start = 0;
  end = CONSTANTS.SERVICES_NUM;
  openPopup = false;
  @ViewChild('tooltip') tooltip: ElementRef;
  openShareBranchPopup = false;
  indexNoBankat: string;
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
    this.indexNoBankat = this.dataBranchServices.citySelectedIndex;

  }

  openReportproblem() {
    this.openPopup = true;
  }

  ngAfterViewInit() {

  }
  copyToClipboard(element) {
    console.log(element);
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (element));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

}
