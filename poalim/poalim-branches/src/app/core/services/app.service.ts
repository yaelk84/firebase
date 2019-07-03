import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private apiService: ApiService, private translateService: RcTranslateService) {
  }
  public appConfig;

  initApp(): Observable<any> {
    return forkJoin([this.loadTranslation(),this.loadConfig()]).pipe(
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


}
