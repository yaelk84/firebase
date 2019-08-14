import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {ActivatedRoute, Router} from '@angular/router';
import {BranchDataService} from '../../core/services/branch-data.service';
import {AppService} from '../../core/services/app.service';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {AgmMap} from '@agm/core';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss', '../branch-box-summarize/branch-box-summarize.component.scss']
})
export class MapComponent implements OnInit {
  @Input() branches: any;
  singleBranchDisplay: any;
  geoCoordinateY = 32.09472;
  geoCoordinateX = 34.8236;
  // latAfterCenterChanged: number;
  // lngAfterCenterChanged: number;
  zoom = 12;
  hasAccessToMyLocation = false;
  branchIcon = {
    url: 'assets/media/branch-marker.svg',
    scaledSize: {width: 30, height: 30}
  };
  bankatAndHoverIcon = {
    url: 'assets/media/bankat-shape.png',
    scaledSize: {width: 30, height: 30}
  };

  myLocationIcon = {
    url: 'assets/media/myLocation-marker.svg',
    scaledSize: {width: 50, height: 70}
  };
  currentCenter: GeoLocationObject;
  findHereCenter: GeoLocationObject;
  isShowCircle = false;
  showSingleDisplay = false;
  // @ViewChild('agmMap') agmMap: AgmMap;

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService, private events: RcEventBusService,
              private router: Router, private activeRoute: ActivatedRoute, private branchDataServices: BranchDataService,
              private appService: AppService, private filterService: BranchFilterService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('branchesss from map comp', this.branches);
    this.events.on(CONSTANTS.EVENTS.SINGLE_DISPLY, () => {
      this.singleBranchDisplay = this.branchDataServices.singleBranchToDisplay;
      this.showSingleDisplay = this.branchDataServices.isSingleDisplay;
      console.log('999999999', this.singleBranchDisplay);
      console.log('444444444', this.showSingleDisplay);
    }, true);
    // setTimeout(() => { this.agmMap.triggerResize(); }, 500);
    this.showBranchesBasedOnLocationAccess();
    this.singleBranchDisplay = this.branchDataServices.singleBranchToDisplay;
    this.showSingleDisplay = this.branchDataServices.isSingleDisplay;
    // this.events.on(CONSTANTS.EVENTS.UPDATE_BRANCH_FROM_MAP, () => {
    //   this.showBranchesBasedOnLocationAccess();
    // }, true);
  }

  showBranchesBasedOnLocationAccess() {
    this.events.on(CONSTANTS.EVENTS.REFRESH_LIST, () => {
      setTimeout(() => {
        console.log('branchesss from map 2', this.branches);
        this.geoCoordinateY = this.branches[0].coords.lat;
        this.geoCoordinateX = this.branches[0].coords.lng;
        if (this.mapBranches.hasLocationPermission) {
          this.hasAccessToMyLocation = true;
          const point = this.mapBranches.position;
          this.geoCoordinateY = (point as GeoLocationObject).lat;
          this.geoCoordinateX = (point as GeoLocationObject).lng;
          this.currentCenter = (point as GeoLocationObject);
          console.log('center with location', this.currentCenter);
        } else {
          this.hasAccessToMyLocation = false;
          this.currentCenter = {lat: this.geoCoordinateY, lng: this.geoCoordinateX};
          console.log('center with !NO! location', this.currentCenter);
        }
      }, 0);

    }, true);
  }

  showSelectedMarkerOnBranchList(id, indexNoBankat) {
    this.branchDataServices.indexNoBankat = indexNoBankat;
    console.log('branchid',id)
    this.router.navigate([], {queryParams: {branch: id}, relativeTo: this.activeRoute});
  }

  // get isSingleMarker() {
  //   return this.branchDataServices.isSingleDisplay;
  // }

  getNewCenterOfCircle(newCoords) {
    this.geoCoordinateY = newCoords.lat;
    this.geoCoordinateX = newCoords.lng;
    console.log('~~~~triggered when center change~~~~~', this.geoCoordinateY, this.geoCoordinateX);
    this.mapBranches.myLocationFilter({
      lat: this.geoCoordinateY,
      lng: this.geoCoordinateX
    }, this.appService.branches)
      .subscribe((res) => {
         console.log('reeeees', res);
         // this.branches = this.branchDataServices.createDataArray(res);
         this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices.createDataArray(res),
           this.filterService.activeFilters);
         console.log('branches-after', this.branches);
         // console.log('filterService---activeFilters', this.filterService.activeFilters);
      });
  }

  showCircle(newCoordsCenter) {
    this.findHereCenter = newCoordsCenter;
    this.mapBranches.getCenterOfNewLocation(this.currentCenter, this.findHereCenter).subscribe((distance) => {
        if (distance > 3) {
          // console.log('distance from prev center', distance);
          return this.isShowCircle = true;
        }
      });
    this.isShowCircle = false;
  }

  searchOnArea() {
      this.geoCoordinateY = this.findHereCenter.lat;
      this.geoCoordinateX = this.findHereCenter.lng;
      this.getNewCenterOfCircle({lat: this.geoCoordinateY, lng: this.geoCoordinateX});
  }
}
