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


    const customIntervalObservable = Observable.create(observer => {
      let count = 0;
      setTimeout(() => {
        observer.next(count);
        observer.complete();
        count++;
      }, 1000);
    });


    this.firstObsSubscription = customIntervalObservable.pipe(filter(data => {
      return data > 0;
    }), map((data: number) => {
      return 'Round: ' + (data + 1);
    })).subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
      alert(error.message);
    }, () => {
      console.log('Completed!');
    });




  return forkJoin([this.apiService.getGetCurrentTimeStamp(), this.apiService.getBranches(), this.apiService.getGetCities(), customIntervalObservable , this.mapBranches.getMyLocation()]).pipe(
      switchMap((results: any) => {
        console.log('returnnnnnnnnnnnnnnnnn', results);
        const objResult = {
          time: {}, branches: [], location: {}, cities: []
        };
        objResult.time = results[0];
        objResult.branches = results[1];
        this.branches = results[1];
      objResult.cities = results[2];
        this.cities = results[2].cities;
        objResult.location = results[4];

      return of(objResult)

      }),
      catchError((error: any) => {
        console.log(error);

        return throwError(error);
      })
    );
  }


}
