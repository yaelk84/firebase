import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {BehaviorSubject, Observable, of, Subject, Subscription, throwError} from 'rxjs';
import {catchError, filter, map, switchMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {MapBranchesService} from './map-branches.service';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private apiService: ApiService, private translateService: RcTranslateService, private mapBranches: MapBranchesService) {
  }

  public appConfig;
  public cities = [];
  public branches = [];
  public initGeneralMessages = {};
  public initBranchMessages = {};
  public queryParam = {};
  private firstObsSubscription: Subscription;


  initApp(): Observable<any> {
    return forkJoin([this.loadTranslation(), this.loadConfig()]).pipe(
      map((response: any) => {
        return of({});
      }));
  }

  public loadTranslation(): Observable<any> {
    return this.apiService.getTranslation()
      .pipe(
        map((response: any) => {

          this.translateService.setTranslation(response);
          return of({});
        }));
  }

  public loadConfig(): Observable<any> {
    return this.apiService.getConfig()
      .pipe(
        map((response: any) => {
          this.appConfig = response;
          return of({});
        }));
  }



init() {
  return forkJoin([this.apiService.getGetCurrentTimeStamp(), this.apiService.getBranches(),
    this.apiService.getGetCities(), this.apiService.getBranchesInit()]).pipe(
      switchMap((results: any) => {

        const objResult = {
          time: {}, branches: [], location: {}, cities: [], uniqueInit: {}
        };
        objResult.time = results[0];
        objResult.branches = results[1];
        this.branches = results[1];
        objResult.cities = results[2];
        this.cities = results[2].cities;
        objResult.location = results[4];
        objResult.uniqueInit = results[3];
        this.initGeneralMessages = results[3].generalMessages;
        this.initBranchMessages = results[3].byBranchMessages;

        return of(objResult);
      }),
      catchError((error: any) => {
        console.log(error);

        return throwError(error);
      })
    );
  }

}
