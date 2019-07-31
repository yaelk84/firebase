import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {BranchDataService} from '../../core/services/branch-data.service';
import {FilterBranchPipe} from '../../core/filters/branch-filter.pipe';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss', '../branch-box-summarize/branch-box-summarize.component.scss']
})
export class MapComponent implements OnInit {
  labelIndex = 1;
  labelIndexCount = 1;
  markerCounter: number;
  @Input() branches: any;
  geoCoordinateY = 32.0853;
  geoCoordinateX = 34.7818;
  zoom = 13;
  hasAccessToMyLocation = false;
  // showBankatIcon = false;
  branchesMapMarker = [];
  summarizedBranchesArr = [];
  centerCoordsArr = [];
  centerBranchesMarker = [];
  distancesArr = [];
  branchesDataSumBasedOnLocationAccessArr = [];
  markersBasedOnLocationAccessArr = [];
  isBankatArr = [];
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
  label = {};

  constructor(private apiService: ApiService, private mapBranches: MapBranchesService, private branchData: BranchDataService,
              private filterBranchPipe: FilterBranchPipe, private events: RcEventBusService, private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.showBranchesBasedOnLocationAccess();
    this.events.on(CONSTANTS.EVENTS.UPDATE_BRANCH_FROM_MAP, () => {
      this.showBranchesBasedOnLocationAccess();
      this.zoom = 15;
      });
  }

  generateArrayOfBranchesBasedOnLocationAccess(markersBasedOnLocationAccessArr) {
    const arrDataTypeToDisplay = this.mapBranches.sortedBranches;
    arrDataTypeToDisplay.forEach((distance, index) => {
      distance = arrDataTypeToDisplay[index].geographicAddress[0].distanceInKm;
      if (distance !== undefined) {
        this.distancesArr.push(distance);
      }
    });
    console.log('!!!!!!!!!!!', this.distancesArr);
    this.mapBranches.getGeoCoordinateArray(arrDataTypeToDisplay).subscribe(geoCoordsArr => {
      this.branchesDataSumBasedOnLocationAccessArr = (geoCoordsArr as Array<any>);
    });
    arrDataTypeToDisplay.forEach((branchFilteredData) => {
      const branchesSumData = this.branchData.createSingleBranch(branchFilteredData);
      const checkIfIsBankat = branchesSumData.isBankat;
      this.isBankatArr.push(checkIfIsBankat);
      markersBasedOnLocationAccessArr.push(branchesSumData.branchSummarize);
    });
    // debugger;
    if (this.isBankatArr.length >= 16) {
      const isBankatNearestBranchesArr = this.isBankatArr.slice(6, this.isBankatArr.length);
      console.log('11111', isBankatNearestBranchesArr);
      this.isBankatArr = isBankatNearestBranchesArr;
      this.markerCounter = 10;
    } else {
      this.markerCounter = 6;
    }
    console.log('55555555', this.isBankatArr);
    markersBasedOnLocationAccessArr.map((dataToAddForEachBranchSum, i) => {
      dataToAddForEachBranchSum.coords = this.branchesDataSumBasedOnLocationAccessArr[i];
      dataToAddForEachBranchSum.distanceInKm = dataToAddForEachBranchSum.distanceInKm ? this.distancesArr[i] : 0;
      dataToAddForEachBranchSum.isBankat = this.isBankatArr[i];
      dataToAddForEachBranchSum.imgUrl = dataToAddForEachBranchSum.isBankat ? this.bankatIcon : this.branchIcon;
      dataToAddForEachBranchSum.label = dataToAddForEachBranchSum.isBankat ? '' : this.label = {
        text: this.markerCounter >= 10 ? this.labelIndexCount++ + '' : this.labelIndex++ + '',
        color: 'white',
        fontFamily: '',
        fontSize: '14px',
        fontWeight: 'bold'
      } ;
    });
  }

  // generateArrayOfBranchesBasedOnLocationAccess() {
  //   const arrDataTypeToDisplay = this.mapBranches.sortedBranches;
  //   arrDataTypeToDisplay.forEach((distance, index) => {
  //     distance = arrDataTypeToDisplay[index].geographicAddress[0].distanceInKm;
  //     if (distance !== undefined) {
  //       this.distancesArr.push(distance);
  //     }
  //   });
  //   console.log('!!!!!!!!!!!', this.distancesArr);
  //   this.mapBranches.getGeoCoordinateArray(arrDataTypeToDisplay).subscribe(geoCoordsArr => {
  //     this.branchesDataSumBasedOnLocationAccessArr = (geoCoordsArr as Array<any>);
  //   });
  //   arrDataTypeToDisplay.forEach((branchFilteredData) => {
  //     const branchesSumData = this.branchData.createSingleBranch(branchFilteredData);
  //     this.markersBasedOnLocationAccessArr.push(branchesSumData.branchSummarize);
  //   });
  //   this.markersBasedOnLocationAccessArr.map((dataToAddForEachBranchSum, i) => {
  //     dataToAddForEachBranchSum.coords = this.branchesDataSumBasedOnLocationAccessArr[i];
  //     dataToAddForEachBranchSum.distanceInKm = dataToAddForEachBranchSum.distanceInKm ? this.distancesArr[i] : 0;
  //   });
  // }

  showBranchesBasedOnLocationAccess() {
    if (!this.mapBranches.hasLocationPermission) {
      this.generateArrayOfBranchesBasedOnLocationAccess(this.centerBranchesMarker); //
      // const centerBranches = this.mapBranches.sortedBranches;
      // this.mapBranches.getGeoCoordinateArray(centerBranches).subscribe(geoCoordsArr => {
      //   this.centerCoordsArr = (geoCoordsArr as Array<any>);
      // });
      // centerBranches.forEach((centered) => {
      //   const centeredBranchesSum = this.branchData.createSingleBranch(centered);
      //   this.centerBranchesMarker.push(centeredBranchesSum.branchSummarize);
      // });
      // this.centerBranchesMarker.map((cb, i) => {
      //   cb.coords = this.centerCoordsArr[i];
      //   cb.distanceInKm = cb.distanceInKm ? this.distancesArr[i] : 0;
      // });
      console.log('qqqqq', this.centerBranchesMarker);

      // this.branchesMapMarker = this.mapBranches.branchesPointsMap;
      // this.labelData = this.filterBranchPipe.addIndexes(this.labelData);
    } else {
      this.hasAccessToMyLocation = true;
      const point = this.mapBranches.position;
      this.geoCoordinateY = (point as GeoLocationObject).lat;
      this.geoCoordinateX = (point as GeoLocationObject).lng;
      this.generateArrayOfBranchesBasedOnLocationAccess(this.summarizedBranchesArr); //
      // const response = this.mapBranches.sortedBranches;
      // response.forEach((d, index) => {
      //   d = response[index].geographicAddress[0].distanceInKm;
      //   this.distancesArr.push(d);
      // });
      // response.forEach((branchDataSum) => {
      //   const branchSumObj = this.branchData.createSingleBranch(branchDataSum);
      //   // console.log('branchSumObj',  branchSumObj);
      //   // if (branchSumObj.isBankat) {
      //   // }
      //   // console.log(branchSumObj);
      //   this.summarizedBranchesArr.push(branchSumObj.branchSummarize);
      // });
      // this.mapBranches.getGeoCoordinateArray(response).subscribe(near => {
      //   this.branchesMapMarker = (near as Array<any>);
      //   // console.log('branchesMapMarker!!!!', this.branchesMapMarker); //
      // });
      // this.summarizedBranchesArr.map((bs, i) => {
      //   bs.coords = this.branchesMapMarker[i];
      //   bs.distanceInKm = bs.distanceInKm ? this.distancesArr[i] : 0;
      // });
      console.log('summarizedBranchesArr', this.summarizedBranchesArr);
    }
  }

  showChosenBranch() {
    // if (this.route.queryParams) {
    // }
    this.activatedRoute.queryParams.subscribe(params => {

    });
  }

}
