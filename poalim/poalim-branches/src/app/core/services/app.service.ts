import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {Observable, of, Subject, Subscription, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {MapBranchesService} from './map-branches.service';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private apiService: ApiService, private translateService: RcTranslateService, private mapBranches: MapBranchesService) {
  }

  public appConfig;

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

    return forkJoin([this.apiService.getGetCurrentTimeStamp(), this.apiService.getBranches()]).pipe(
      switchMap((results: any) => {
        const  objResult = {
          time: {}, branches: [] ,location: {}
        };
        objResult.time = results[0];
        objResult.branches = results[1];
        this.mapBranches.getMyLocation().subscribe((res: any) => {  /* call the location to know location updated*/
          objResult.location = res;
        });
        return of(objResult);
      }),
      catchError((error: any) => {
        console.log(error);

        return throwError(error);
      })
    );
  }

}
