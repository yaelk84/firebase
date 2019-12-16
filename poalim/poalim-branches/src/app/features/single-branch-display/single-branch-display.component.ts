import {Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {CONSTANTS} from '../../constants';
import {PerfectScrollbarModule, PerfectScrollbarConfigInterface, PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {isNullOrUndefined} from 'util';
import {DeviceService} from '../../core/services/device.service';
import {environment} from '../../../environments/environment';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {RcEventBusService, RcTranslateService} from '@realcommerce/rc-packages';
import {GeoLocationObject} from '../../core/interface/coordinates';


@Component({
  selector: 'app-single-branch-display',
  templateUrl: './single-branch-display.component.html',
  styleUrls: ['./single-branch-display.component.scss']
})

export class SingleBranchDisplayComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild('phone') elementView: ElementRef;
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  branchIcon = {
    url: `${environment.imgUrlPath}branch-marker.svg`,
    scaledSize: {width: 29, height: 29}
  };
  bankatAndHoverIcon = {
    url: `${environment.imgUrlPath}bankat-shape.png`,
    scaledSize: {width: 29, height: 29}
  };
  myLocationIcon = {
    url: `${environment.imgUrlPath}myLocation-marker.svg`,
    scaledSize: {width: 50, height: 70}
  };

  lat: number;
  lng: number;
  isMyLocationAccess = false;
  branches: any;

  constructor(private deviceService: DeviceService, private mapBranches: MapBranchesService, private events: RcEventBusService, private translate: RcTranslateService) {
  }

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
    this.showBranchesBasedOnLocationAccess();

    this.isMobile = this.deviceService.isMobile();
    this.indexNoBankat = !isNullOrUndefined(this.dataBranchSelected.indexForDisplay) && this.dataBranchSelected.indexForDisplay > 0 ? this.dataBranchSelected.indexForDisplay : 1;
  }

  showBranchesBasedOnLocationAccess() {
    this.events.on(CONSTANTS.EVENTS.REFRESH_LIST, () => {
      setTimeout(() => {
        if (this.mapBranches.hasLocationPermission) {
          this.isMyLocationAccess = true;
          const point = this.mapBranches.position;
          this.lat = (point as GeoLocationObject).lat;
          this.lng = (point as GeoLocationObject).lng;
        } else {
          this.isMyLocationAccess = false;
        }
      }, 0);

    }, true);
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
      } else {
        e.clipboardData.setData('text/plain', (element));
      }
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  onNavigate() {
    window.location.href =
      `https://www.waze.com/ul?ll=${this.dataBranchSelected.coords.lat}%2C${this.dataBranchSelected.coords.lng}&navigate=yes&zoom=15`;
  }

  get textCopyNumber() {
    return this.translate.getText('copyNumber');
  }

}
