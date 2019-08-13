import {Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {CONSTANTS} from '../../constants';
import {PerfectScrollbarModule, PerfectScrollbarConfigInterface, PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {BranchDataService} from '../../core/services/branch-data.service';
import {isNullOrUndefined} from 'util';
import {DeviceService} from '../../core/services/device.service';

@Component({
  selector: 'app-single-branch-display',
  templateUrl: './single-branch-display.component.html',
  styleUrls: ['./single-branch-display.component.scss']
})

export class SingleBranchDisplayComponent implements OnInit, AfterViewInit {
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild('phone') elementView: ElementRef;
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor( private deviceService: DeviceService) {
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
  isMobile = false;


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
    this.isMobile = this.deviceService.isMobile();
    this.indexNoBankat = !isNullOrUndefined(this.dataBranchSelected.indexForDisplay) &&  this.dataBranchSelected.indexForDisplay > 0 ? this.dataBranchSelected.indexForDisplay : 1;

  }

  openReportproblem() {
    this.openPopup = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('scroll')
      if (this.deviceService.isMobile()) {
        if (!isNullOrUndefined(this.componentRef)) {
          this.componentRef.directiveRef.ps().destroy();
        }

      }
    }, 200);

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
