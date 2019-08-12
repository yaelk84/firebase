import {Component, Input, OnInit, ViewRef} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {ActivatedRoute, Router} from '@angular/router';
import {BranchDataService} from '../../core/services/branch-data.service';
import {AppService} from '../../core/services/app.service';
import {BranchFilterService} from '../../core/services/branch-filter.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss', '../branch-box-summarize/branch-box-summarize.component.scss']
})
export class MapComponent implements OnInit {
  @Input() branches: any;
  geoCoordinateY = 32.09472;
  geoCoordinateX = 34.8236;
  latAfterCenterChanged: number;
  lngAfterCenterChanged: number;
  zoom = 15;
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

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService, private events: RcEventBusService,
              private router: Router, private activeRoute: ActivatedRoute, private branchDataServices: BranchDataService,
              private appService: AppService, private filterService: BranchFilterService) {
  }

  ngOnInit() {
    console.log('branchesss from map comp', this.branches);
    this.showBranchesBasedOnLocationAccess();
    // this.events.on(CONSTANTS.EVENTS.UPDATE_BRANCH_FROM_MAP, () => {
    //   this.showBranchesBasedOnLocationAccess();
    // });
  }

  showBranchesBasedOnLocationAccess() {
    this.events.on(CONSTANTS.EVENTS.REFRESH_LIST, () => {
      if (this.mapBranches.hasLocationPermission) {
        this.hasAccessToMyLocation = true;
        const point = this.mapBranches.position;
        this.geoCoordinateY = (point as GeoLocationObject).lat;
        this.geoCoordinateX = (point as GeoLocationObject).lng;
        this.currentCenter = (point as GeoLocationObject);
        // console.log('center with location', this.currentCenter);
      } else {
        this.hasAccessToMyLocation = false;
        this.currentCenter = {lat: this.geoCoordinateY, lng: this.geoCoordinateX};
        // console.log('center with !NO! location', this.currentCenter);
      }
    });
  }

  showSelectedMarkerOnBranchList(id) {
    this.router.navigate([], {queryParams: {branch: id}, relativeTo: this.activeRoute});
    // console.log(this.activeRoute.snapshot.queryParams.branch);
  }

  get showSingleDisplay() {
    return this.branchDataServices.isSingleDisplay;
  }

  getNewCenterOfCircle(newCoords) {
    this.latAfterCenterChanged = newCoords.lat;
    this.lngAfterCenterChanged = newCoords.lng;
    console.log('~~~~triggered when center change~~~~~', this.latAfterCenterChanged, this.lngAfterCenterChanged);
    this.mapBranches.myLocationFilter({
      lat: this.latAfterCenterChanged,
      lng: this.lngAfterCenterChanged
    }, this.appService.branches)
      .subscribe((res) => {
        // console.log('reeeees', res);
        this.branchDataServices.initBranchesAndApplyFilters(this.branchDataServices.createDataArray(res), this.filterService.activeFilters);
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
  }

  searchOnArea() {
      this.geoCoordinateY = this.findHereCenter.lat;
      this.geoCoordinateX = this.findHereCenter.lng;
      this.getNewCenterOfCircle({lat: this.geoCoordinateY, lng: this.geoCoordinateX});
  }
}
