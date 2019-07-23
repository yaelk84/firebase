import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {error} from "@angular/compiler/src/util";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() branches: any;
  geoCoordinateX: number;
  geoCoordinateY: number;
  zoom = 10;
  branchesMapMarker = [];

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService ) { }

   ngOnInit() {
     // this.geoCoordinateX = this.branches[0].geographicAddress[0].geographicCoordinate.geoCoordinateX;
     // this.geoCoordinateY = this.branches[0].geographicAddress[0].geographicCoordinate.geoCoordinateY;
     // debugger;
     if (this.mapBranches.myLocation.lat && this.mapBranches.myLocation.lng) {
      this.geoCoordinateX = this.mapBranches.myLocation.lat;
      this.geoCoordinateY = this.mapBranches.myLocation.lng;
      this.mapBranches.myLocationFilter({lat: this.mapBranches.myLocation.lat, lng: this.mapBranches.myLocation.lng},
         this.branches).subscribe((response) => {
         console.log('response', response);
         this.branchesMapMarker = this.mapBranches.getGeoCoordinateArray(response);
         // console.log('response', this.branchesMapMarker );
       });
    } else {
       this.mapBranches.defaultFilter().subscribe((centerBranches) => {
         console.log('centerBranches', centerBranches);
         this.branchesMapMarker = this.mapBranches.branchesPointsMap;
       });
     }
   }
}
