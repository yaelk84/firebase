import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {BranchDataService} from '../../core/services/branch-data.service';
import {FilterBranchPipe} from '../../core/filters/branch-filter.pipe';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss', '../branch-box-summarize/branch-box-summarize.component.scss']
})
export class MapComponent implements OnInit {
  labelIndex = 1;
  labelIndexCount = 1;
  markerCounter: number;
  isMapLoaded = false;
  @Input() branches: any;
  geoCoordinateY = 32.0853;
  geoCoordinateX = 34.7818;
  zoom = 13;
  hasAccessToMyLocation = false;
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
      width: 35,
      height: 45
    }
  };

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService) {
  }

  ngOnInit() {
    this.showBranchesBasedOnLocationAccess();
    // this.events.on(CONSTANTS.EVENTS.UPDATE_BRANCH_FROM_MAP, () => {
    //   this.showBranchesBasedOnLocationAccess();
    //   this.zoom = 15;
    // });
  }
  // generateArrayOfBranchesBasedOnLocationAccess() {
  //     this.branches.map((dataToAddForEachBranchSum, i) => {
  //       dataToAddForEachBranchSum.mapData = {
  //         coords: this.geoCoordinateArr[i],
  //         // distanceInKm = dataToAddForEachBranchSum.branchSummarize.distanceInKm ? this.distancesArr[i] : 0;
  //         //  isBankat:  this.createSummarizedData[i].isBankat,
  //         imgUrl: dataToAddForEachBranchSum.isBankat ? this.bankatIcon : this.branchIcon,
  //         label: dataToAddForEachBranchSum.isBankat ? '' : {
  //           text: this.markerCounter >= 10 ? this.labelIndexCount++ + '' : this.labelIndex++ + '',
  //           color: 'white',
  //           fontFamily: '',
  //           fontSize: '14px',
  //           fontWeight: 'bold'
  //         }
  //       };
  //     });
  //     console.log('DONE generateArrayOfBranchesBasedOnLocationAccess', this.branches);
  //   });
  // }

  showBranchesBasedOnLocationAccess() {
    if (this.mapBranches.hasLocationPermission) {
      this.hasAccessToMyLocation = true;
      const point = this.mapBranches.position;
      this.geoCoordinateY = (point as GeoLocationObject).lat;
      this.geoCoordinateX = (point as GeoLocationObject).lng;
    }
    // this.generateArrayOfBranchesBasedOnLocationAccess();
  }

  // generateArrayOfBranchesBasedOnLocationAccess() {
  //   this.markersBasedOnLocationAccessArr = [];
  //   const arrDataTypeToDisplay = this.mapBranches.sortedBranches;
  //   arrDataTypeToDisplay.forEach((distance, index) => {
  //     distance = arrDataTypeToDisplay[index].geographicAddress[0].distanceInKm;
  //     if (distance !== undefined) {
  //       this.distancesArr.push(distance);
  //     }
  //   });
  //   // console.log('distances', this.distancesArr);
  //   this.mapBranches.getGeoCoordinateArray(arrDataTypeToDisplay).subscribe(geoCoordsArr => {
  //     this.branchesDataSumBasedOnLocationAccessArr = (geoCoordsArr as Array<any>);
  //   });
  //   arrDataTypeToDisplay.forEach((branchFilteredData) => {
  //     const branchesSumData = this.branchData.createSingleBranch(branchFilteredData);
  //     const checkIfIsBankat = branchesSumData.isBankat;
  //     this.isBankatArr.push(checkIfIsBankat);
  //     this.markersBasedOnLocationAccessArr.push(branchesSumData);
  //   });
  //   if (this.isBankatArr.length >= 16) {
  //     const isBankatNearestBranchesArr = this.isBankatArr.slice(6, this.isBankatArr.length);
  //     // console.log('11111', isBankatNearestBranchesArr);
  //     this.isBankatArr = isBankatNearestBranchesArr;
  //     this.markerCounter = 10;
  //   } else {
  //     this.markerCounter = 6;
  //   }
  //   // console.log('55555555', this.isBankatArr);
  //   this.markersBasedOnLocationAccessArr.map((dataToAddForEachBranchSum, i) => {
  //     dataToAddForEachBranchSum.coords = this.branchesDataSumBasedOnLocationAccessArr[i];
  //     dataToAddForEachBranchSum.distanceInKm = dataToAddForEachBranchSum.branchSummarize.distanceInKm ? this.distancesArr[i] : 0;
  //     // dataToAddForEachBranchSum.isBankat = this.isBankatArr[i];
  //     dataToAddForEachBranchSum.imgUrl = dataToAddForEachBranchSum.isBankat ? this.bankatIcon : this.branchIcon;
  //     dataToAddForEachBranchSum.label = dataToAddForEachBranchSum.isBankat ? '' : this.label = {
  //       text: this.markerCounter >= 10 ? this.labelIndexCount++ + '' : this.labelIndex++ + '',
  //       color: 'white',
  //       fontFamily: '',
  //       fontSize: '14px',
  //       fontWeight: 'bold'
  //     } ;
  //   });
  //   console.log('this.markersBasedOnLocationAccessArr', this.markersBasedOnLocationAccessArr);
  //   return this.markersBasedOnLocationAccessArr;
  // }
}
