import {Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {CONSTANTS} from '../../constants';
import {PerfectScrollbarModule, PerfectScrollbarConfigInterface, PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {isNullOrUndefined} from 'util';
import {DeviceService} from '../../core/services/device.service';


@Component({
  selector: 'app-single-branch-display',
  templateUrl: './single-branch-display.component.html',
  styleUrls: ['./single-branch-display.component.scss']
})

export class SingleBranchDisplayComponent implements OnInit {
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

 ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.indexNoBankat = !isNullOrUndefined(this.dataBranchSelected.indexForDisplay) &&  this.dataBranchSelected.indexForDisplay > 0 ? this.dataBranchSelected.indexForDisplay : 1;

  }

  openReportproblem() {
    this.openPopup = true;
  }



  copyToClipboard(element) {
    const elementArr = element.split('').slice(0, element.length - 1);
    elementArr.unshift('*');
    const joinElm = elementArr.join('');
    document.addEventListener('copy', (e: ClipboardEvent) => {
      if (element === '2407*') {
        e.clipboardData.setData('text/plain', (joinElm));
        console.log('copy phone', joinElm);
      } else {
        e.clipboardData.setData('text/plain', (element));
        console.log('copy fax', element);
      }
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

}
