import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {IHttpType, IUser} from '../models/model';
import {CONSTANTS} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) {
  }

  public githubSearch(searchKeyWord): Observable<[]> {

    return this.http.get(`https://api.github.com/search/repositories?q=${searchKeyWord}`).pipe(
      mergeMap((response: { items: [] }) => {
        return of(response.items)
      })
    );
  }

  public login(user: IUser): Observable<string> {

    return this.http.get('/assets/stub/login.json').pipe(
      mergeMap((response: { Token: string }) => {
        return of(response.Token ? response.Token : '')
      })
    );
  }

  private apiWrapper(httpType: string, url: string, params = {}): Observable<any> {
    const token = localStorage.getItem(CONSTANTS.TOKEN);

    switch (httpType) {
      case IHttpType.get: {

        return this.http.get(url, {params: params});
        break;
      }
      case IHttpType.post: {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }

    }


  }
}
