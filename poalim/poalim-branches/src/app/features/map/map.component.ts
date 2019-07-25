import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {BranchDataService} from '../../core/services/branch-data.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() branches: any;
  geoCoordinateY = 32.0853;
  geoCoordinateX = 34.7818;
  zoom = 14;
  hasAccessToMyLocation = false;
  branchesMapMarker = [];
  summarizedBranchesArr = [];
  distancesArr = [];
  labelData = {
    color: '#ffffff',
    fontWeight: 'bold',
    text: '1'
  };
  branchIcon = {
    url: 'assets/media/branch-marker.svg',
    scaledSize: {
      width: 35,
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
      height: 50,
    }
  };

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService, private branchData: BranchDataService) { }

   ngOnInit() {
      this.mapBranches.getMyLocation().subscribe(geolocation => {
         this.hasAccessToMyLocation = true;
         this.geoCoordinateY = (geolocation as GeoLocationObject).lat;
         this.geoCoordinateX = (geolocation as GeoLocationObject).lng;
         this.mapBranches.myLocationFilter({lat: this.geoCoordinateY, lng: this.geoCoordinateX},
           this.branches).subscribe((response) => {
             response.forEach((d, index) => {
               d = response[index].geographicAddress[0].distanceInKm;
               this.distancesArr.push(d);
             });
             console.log('distancesArr', this.distancesArr); //
             // console.log('#################', response);
             response.forEach((branchDataSum) => {
               const branchSumObj = this.branchData.createSingleBranch(branchDataSum);
               // console.log('branchSumObj',  branchSumObj); //
               if (branchSumObj.isBankat) {
                 // branchSumObj.isBankat = true;
                 this.branchIcon = this.bankatIcon;
               }
               // console.log(branchSumObj);
               this.summarizedBranchesArr.push(branchSumObj.branchSummarize);
             });
             this.mapBranches.getGeoCoordinateArray(response).subscribe(near => {
             this.branchesMapMarker = (near as Array<any>);
             // console.log('branchesMapMarker!!!!', this.branchesMapMarker); //
           });
             this.summarizedBranchesArr.map((bs, i) => {
             bs.coords = this.branchesMapMarker[i];
             bs.distanceInKm = this.distancesArr[i];
           });
             console.log('summarizedBranchesArr', this.summarizedBranchesArr);
           // this.branchesMapMarker = this.mapBranches.getGeoCoordinateArray(response);
         });
     }, error => {
        this.mapBranches.defaultFilter().subscribe((centerBranches) => {
          this.branchesMapMarker = this.mapBranches.branchesPointsMap;
        });
      });
   }

   createBranchLabel(arr: Array<any>) {
    arr.forEach((b) => {
      this.branchData.createSingleBranch(b);
    });
   }
}
