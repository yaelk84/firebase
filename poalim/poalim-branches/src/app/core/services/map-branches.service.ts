/// <reference types="@types/googlemaps" />
import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {MapsAPILoader} from '@agm/core';
import {Observable} from 'rxjs';
import {GeoLocationObject} from '../interface/coordinates';
import {error} from '@angular/compiler/src/util';
import {CONSTANTS} from '../../constants';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {AppService} from './app.service';


@Injectable({
  providedIn: 'root'
})
export class MapBranchesService {

  branchesPointsMap = [];
  filteredMarkers = [];
  sortedBranches = [];
  hasLocationPermission = false;
  hasLocationPermissionFromGeoLocation = false;
  position: object;
  nearsBranches: Array<object> ;
  lat: number;
  lng: number;

  constructor(private apiService: ApiService, private mapsAPILoader: MapsAPILoader , private  events: RcEventBusService) {
  }
  changeFilterLoactionToTrue(){
    this.sortedBranches = this.nearsBranches;
    }
  // will take the mockData and filter it by city name = 'תל אביב' and will display only the 6 nearest branches
  defaultFilter(branches) {
    const filteredByCity = branches.filter(branch => {
      if (branch.geographicAddress[0].cityName === 'תל אביב-יפו') {
        return branch;
      }
    });

    this.sortedBranches = filteredByCity.slice(6, 12);


    return this.sortedBranches;
  }

  getGeoCoordinateArray(arr: Array<any>) {
    const geocoordsArray = new Observable(observer => {
      const newGeoArr = [];
      for (let i = 0; i < arr.length; i++) {
        const cityPoint = arr[i].geographicAddress[0].geographicCoordinate;
        newGeoArr.push(cityPoint);
      }
      observer.next(newGeoArr);
    });
    return geocoordsArray;
  }
  // will get my location
  getMyLocation() {
    const myGeoLocation = new Observable(observer => {
      let c = {};
      if (navigator.geolocation) {
        setTimeout(() => {
          observer.next({});
        }, 100);
        navigator.geolocation.getCurrentPosition((position: Position) => {
          if (position) {
            c = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          }
          this.hasLocationPermission = true;
          this.position = c;
          observer.next(c);
          observer.complete();

        }, err => {
          console.log('111111111', err)
          observer.error(err);

        });
      } else {
        console.log('22222')
        observer.error();
      }
    });
    return myGeoLocation;
  }


  public myLocationFilter(myLatLng: GeoLocationObject, branchesArr = []): any {
    const nearestBranchesObserveble = new Observable(observer => {
      this.branchesPointsMap = branchesArr;
      this.mapsAPILoader.load().then(() => {
        const myCoords = new google.maps.LatLng(myLatLng.lat, myLatLng.lng);
        this.filteredMarkers = this.branchesPointsMap.filter(m => {
          const destination = new google.maps.LatLng(m.geographicAddress[0].geographicCoordinate.geoCoordinateY,
            m.geographicAddress[0].geographicCoordinate.geoCoordinateX);
          const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(myCoords, destination) / 1000;
          m.geographicAddress[0].distanceInKm = distanceInKm;
          if (distanceInKm < 25.0) {
            return m;
          }
        });
        // console.log('this.branchesPointsMap m34', this.branchesPointsMap);
        const nearestBranches = this.filteredMarkers.sort((a, b) => {
          return a.geographicAddress[0].distanceInKm - b.geographicAddress[0].distanceInKm;
        }).slice(0, 10);

        this.sortedBranches = nearestBranches;
        this.events.emit(CONSTANTS.EVENTS.UPDATE_BRANCH_FROM_MAP);
        observer.next(this.sortedBranches);
      });
    });
    return nearestBranchesObserveble;
  }

  // test() {
  //   this.mapsAPILoader.load().then(() => {
  //     const myCoords1 = new google.maps.LatLng(32.08284, 34.78064);
  //     const destination1 = new google.maps.LatLng(32.062787, 34.782296);
  //     const distanceInKm1 = google.maps.geometry.spherical.computeDistanceBetween(myCoords1, destination1) / 1000;
  //     console.log(distanceInKm1);
  //   });
  // }
}

