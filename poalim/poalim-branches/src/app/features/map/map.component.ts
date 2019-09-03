/// <reference types="@types/googlemaps" />
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {ActivatedRoute, Router} from '@angular/router';
import {BranchDataService} from '../../core/services/branch-data.service';
import {AppService} from '../../core/services/app.service';
import {BranchFilterService} from '../../core/services/branch-filter.service';
// import {AgmMap} from '@agm/core';
import {DeviceService} from '../../core/services/event-service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss', '../branch-box-summarize/branch-box-summarize.component.scss']
})
export class MapComponent implements OnInit {
  @Input() branches: any;
  singleBranchDisplay: any;
  latCoordinate = 34.8236;
  lngCoordinate = 32.09472;
  hasAccessToMyLocation = false;
  branchIcon = {
    url: 'assets/media/branch-marker.svg',
    scaledSize: {width: 29, height: 29}
  };
  bankatAndHoverIcon = {
    url: 'assets/media/bankat-shape.png',
    scaledSize: {width: 29, height: 29}
  };

  myLocationIcon = {
    url: 'assets/media/myLocation-marker.svg',
    scaledSize: {width: 50, height: 70}
  };
  currentCenter: GeoLocationObject;
  findHereCenter: GeoLocationObject;
  isShowCircle = false;
  showSingleDisplay = false;
  test = true;
  centerChangeCbTimeout = null;
  zoom: number;
  isMobile = false;
  @Output() goToBranchDetails = new EventEmitter();
  // @ViewChild('agmMap') agmMap: AgmMap;
  @ViewChild('searchOnAreaBtn') searchOnAreaBtn: ElementRef;

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService, private events: RcEventBusService,
              private router: Router, private activeRoute: ActivatedRoute, private branchDataServices: BranchDataService,
              private appService: AppService, private filterService: BranchFilterService, private deviceService: DeviceService,
              private branchFilterService: BranchFilterService) {
  }

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.events.on(CONSTANTS.EVENTS.SINGLE_DISPLY, () => {
      this.singleBranchDisplay = this.branchDataServices.singleBranchToDisplay;
      this.showSingleDisplay = this.branchDataServices.isSingleDisplay;
    }, true);
    this.showBranchesBasedOnLocationAccess();
    this.singleBranchDisplay = this.branchDataServices.singleBranchToDisplay;
    this.showSingleDisplay = this.branchDataServices.isSingleDisplay;
  }

  showBranchesBasedOnLocationAccess() {
    this.events.on(CONSTANTS.EVENTS.REFRESH_LIST, () => {
      setTimeout(() => {
        // console.log('branches from map', this.branches);
        if (this.branches.length > 0) {
          this.latCoordinate = this.branches[1].coords.lat;
          this.lngCoordinate = this.branches[1].coords.lng;
        }
        if (this.mapBranches.hasLocationPermission) {
          this.hasAccessToMyLocation = true;
          const point = this.mapBranches.position;
          this.latCoordinate = (point as GeoLocationObject).lat;
          this.lngCoordinate = (point as GeoLocationObject).lng;
          this.currentCenter = (point as GeoLocationObject);
          // console.log('center WITH location', this.currentCenter);
        } else {
          this.hasAccessToMyLocation = false;
          this.currentCenter = {lat: this.latCoordinate, lng: this.lngCoordinate};
          // console.log('center with !NO! location', this.currentCenter);
        }
      }, 0);

    }, true);
  }

  showSelectedMarkerOnBranchList(id, indexNoBankat, coords) {
    this.branchDataServices.indexNoBankat = indexNoBankat;
    this.currentCenter = {lat: coords.lat, lng: coords.lng};
    this.router.navigate([], {queryParams: {branch: id}, relativeTo: this.activeRoute});
    // console.log('branch coords center', this.currentCenter);
  }

  getNewCenterOfCircle(newCoords) {
    this.latCoordinate = newCoords.lat;
    this.lngCoordinate = newCoords.lng;
    // console.log('~~~~triggered when center change~~~~~', this.latCoordinate, this.lngCoordinate);
    this.mapBranches.myLocationFilter({
      lat: this.latCoordinate,
      lng: this.lngCoordinate
    }, this.appService.branches)
      .subscribe((res) => {
         this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices.createDataArray(res),
           this.filterService.activeFilters);
         // console.log('--search-here--', this.branches);
      });
    if (this.branchFilterService.activeFilters.indexOf(CONSTANTS.FILTER_lOCATION) > -1) {
      this.branchFilterService.toggleFilter(CONSTANTS.FILTER_lOCATION);
    }
  }

  showCircle(newCoordsCenter) {
    this.centerChangeCbTimeout = setTimeout(() => {
      this.findHereCenter = newCoordsCenter;
      this.mapBranches.getCenterOfNewLocation(this.currentCenter, this.findHereCenter).subscribe((distance) => {
        if (distance > 3) {
          return this.isShowCircle = true;
        }
      });
      this.isShowCircle = false;
    }, 20);
  }

  searchOnArea() {
    this.branchDataServices.citySelected = '';
    this.events.emit(CONSTANTS.EVENTS.DELETE_SEARCH);
    this.latCoordinate = this.findHereCenter.lat;
    this.lngCoordinate = this.findHereCenter.lng;

    this.getNewCenterOfCircle({lat: this.latCoordinate, lng: this.lngCoordinate});
    this.searchOnAreaBtn.nativeElement.focus();
  }

  onZoomChange(event) {
    clearTimeout(this.centerChangeCbTimeout);
  }

  onClickGoToBranchDetails() {
    this.goToBranchDetails.emit();
  }
}
