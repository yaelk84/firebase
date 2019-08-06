import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {ActivatedRoute, Router} from '@angular/router';
import {AgmMap, AgmMarker} from "@agm/core";
import {BranchDataService} from "../../core/services/branch-data.service";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss', '../branch-box-summarize/branch-box-summarize.component.scss']
})
export class MapComponent implements OnInit {
  @Input() branches: any;
  geoCoordinateY = 32.09472;
  geoCoordinateX = 34.8236;
  zoom = 15;
  hasAccessToMyLocation = false;
  branchIcon = {
    url: 'assets/media/branch-marker.svg',
    scaledSize: { width: 32, height: 32 }
  };
  bankatAndHoverIcon = {
    url: 'assets/media/bankat-shape.png',
    scaledSize: { width: 32, height: 32 },
  };

  myLocationIcon = {
    url: 'assets/media/myLocation-marker.svg',
    scaledSize: { width: 50, height: 70 },
  };
  singleDisplay = false;

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService, private events: RcEventBusService,
              private router: Router, private activeRoute: ActivatedRoute, private branchDataServices: BranchDataService) {
  }
  ngOnInit() {
    console.log('branchessssssssssssssssssssssssss from map', this.branches);
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
      } else {
        this.hasAccessToMyLocation = false;
      }
    });
  }
  showSelectedMarkerOnBranchList(id) {
    console.log('MARKER WAS CLICKED!!!!!');
    this.router.navigate([], {queryParams: {branch: id}, relativeTo: this.activeRoute});
    console.log(this.activeRoute.snapshot.queryParams.branch);
    this.listenToUrlChanges();
  }
  grabCoords(e) {
    console.log(e);
  }
  listenToUrlChanges() {
    this.activeRoute.queryParams.subscribe((param: any) => {
      this.singleDisplay = true;
      console.log(this.singleDisplay);
    });
  }

  get showSingleDisplay() {
    return this.branchDataServices.isSingleDisplay;
  }
}
