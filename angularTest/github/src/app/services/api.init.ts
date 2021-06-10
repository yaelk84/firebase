import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {IHttpType, IResult, IServerDataItem, IUser} from '../models/model';
import {CONSTANTS} from '../constants';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {


  constructor(private apiService: ApiService) {
  }


    public Init(): Observable<any> {

      return this.apiService.login({name:"6", password:"4"}).pipe(
      mergeMap((token:string) => {

        localStorage.setItem(CONSTANTS.TOKEN, token);
        return of(JSON.parse('true'))
        }));




  }





}
