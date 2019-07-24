import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {timeout} from "rxjs/operators";
import {logger} from "codelyzer/util/logger";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() branches: any;
  geoCoordinateX = 32.064041;
  geoCoordinateY = 34.77539;
  zoom = 14;
  hasAccessToMyLocation = false;
  branchesMapMarker = [];
  branchIcon = {
    url: 'assets/media/branch-marker.svg',
    scaledSize: {
      width: 25,
      height: 45
    }
  };
  myLocationIcon = {
    url: 'assets/media/myLocation-marker.svg',
    scaledSize: {
      width: 50,
      height: 70
    }
  };
  bankatIcon = {
    url: 'assets/media/bankat-marker.svg',
    scaledSize: {
      width: 50,
      height: 70
    }
  };

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService ) { }

   ngOnInit() {
      this.mapBranches.defaultFilter().subscribe((centerBranches) => {
        console.log('centerBranches', centerBranches);
        console.log('aaa');
        this.branchesMapMarker = this.mapBranches.branchesPointsMap;
      });
      this.mapBranches.getMyLocation().subscribe(geolocation => {
         this.hasAccessToMyLocation = true;
         this.geoCoordinateX = (geolocation as GeoLocationObject).lat;
         this.geoCoordinateY = (geolocation as GeoLocationObject).lng;
         this.mapBranches.myLocationFilter({lat: this.geoCoordinateX, lng: this.geoCoordinateY},
           this.branches).subscribe((response) => {
           console.log('response', response);
           setTimeout(() => {
             this.mapBranches.getGeoCoordinateArray(response).subscribe(near => {
               this.branchesMapMarker = (near as Array<any>);
             });
           }, 500);

           // this.branchesMapMarker = this.mapBranches.getGeoCoordinateArray(response);
         });
     });
   }
}
