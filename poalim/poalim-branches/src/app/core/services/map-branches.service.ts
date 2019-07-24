/// <reference types="@types/googlemaps" />
import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {MapsAPILoader} from '@agm/core';
import {Observable} from 'rxjs';
import {GeoLocationObject} from '../interface/coordinates';


@Injectable({
  providedIn: 'root'
})
export class MapBranchesService {

  branchesPointsMap = [];
  filteredMarkers = [];
  hasLocationPermission: boolean;
  lat: number;
  lng: number;
  // lat = 32.064041;
  // lng = 34.77539;


  constructor(private apiService: ApiService, private mapsAPILoader: MapsAPILoader) { }

  // will take the mockData and filter it by city name = 'תל אביב' and will display only the 6 nearest branches
  defaultFilter() {
    const sixCenterBranches = new Observable(observer => {
      this.apiService.getBranches().subscribe((response) => {
        const filteredByCity = response.filter(branch => {
          if (branch.geographicAddress[0].cityName === 'תל אביב-יפו') {
            return branch;
          }
        });
        console.log('filteredByCity', filteredByCity);
        // this.branchesPointsMap = this.getGeoCoordinateArray(filteredByCity.slice(0, 6));
        // observer.next(this.branchesPointsMap);
        this.getGeoCoordinateArray(filteredByCity.slice(0, 6)).subscribe(geoArray => {
          this.branchesPointsMap = (geoArray as Array<any>);
          observer.next(this.branchesPointsMap);

        });
      });
    });
    return sixCenterBranches;
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

  // getGeoCoordinateArray(arr: Array<any>) {
  //   const newGeoArr = [];
  //   for (let i = 0; i < arr.length; i++) {
  //     const cityPoint = arr[i].geographicAddress[0].geographicCoordinate;
  //     newGeoArr.push(cityPoint);
  //   }
  //   return newGeoArr;
  // }

  // will get my location
   getMyLocation() {
    // debugger;
     const myGeoLocation = new Observable(observer => {
       let c = {};
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((position: Position) => {
             if (position) {
               c = {
                 lat:  position.coords.latitude,
                 lng:  position.coords.longitude
               };
             }
             observer.next(c);
         });
       } else {
         alert('Geolocation is not supported by this browser.');
       }
     });
     return myGeoLocation;
   }


  public myLocationFilter(myLatLng: GeoLocationObject, branchesArr = []): any {
    const nearestBranches = new Observable(observer => {
      this.branchesPointsMap = branchesArr;
      this.mapsAPILoader.load().then(() => {
        const myCoords = new google.maps.LatLng(myLatLng.lat, myLatLng.lng);
        this.filteredMarkers = this.branchesPointsMap.filter(m => {
          const destination = new google.maps.LatLng(m.geographicAddress[0].geographicCoordinate.geoCoordinateX,
            m.geographicAddress[0].geographicCoordinate.geoCoordinateY);
          const  distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(myCoords, destination) / 1000;
          m.geographicAddress[0].distanceInKm = distanceInKm;
          if (distanceInKm < 25.0) {
            return m;
          }
        });
        console.log('this.branchesPointsMap m34', this.branchesPointsMap);
        observer.next(this.filteredMarkers.sort((a, b) => {
         return a.geographicAddress[0].distanceInKm - b.geographicAddress[0].distanceInKm;
        }).slice(0, 10));
      });
    });
    return nearestBranches;
  }

  // a function which calculate the distance between two points
  getDistance(myLatLng: GeoLocationObject) {
    const myCoords = new google.maps.LatLng(myLatLng.lat, myLatLng.lng);
    const destination = new google.maps.LatLng(32.082227, 34.781046);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(myCoords, destination);
    console.log(distance / 1000);
  }
  checkIfHaveLocation(res){
    return (res as GeoLocationObject).lat && (res as GeoLocationObject).lng;
  }

}

