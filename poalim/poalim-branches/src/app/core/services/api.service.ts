import {Injectable} from '@angular/core';
import {RcApiService} from '@realcommerce/rc-packages';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, mergeMap, switchMap} from 'rxjs/operators';
import { ApiResponse} from '../models/api-response';
import { ApiError} from '../models/api-response';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends RcApiService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * return api base url
   */
  protected getBaseUrl(): string {
    return environment.apiBaseUrl;
  }


  protected setDefaultHeaders(headers) {
    // headers = new HttpHeaders();
    headers['Accept'] = 'application/json';
    headers['Cache-Control'] = 'no-cache, no-store';
    headers['Content-Type'] = 'application/json; charset=utf-8';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = 'Sat, 01 Jan 2000 00:00:00 GMT';

    // return headers;
  }

  /**
   * Run a GET api call
   * @param path
   * @param requestParams
   * @param force
   * @param handleError
   * @return Observable<any>
   */
  private apiGet(path: string, requestParams: any = {}, force: boolean = true, handleError: boolean = true,
                 doNotThrowError: boolean = false): Observable<any> {
    return this.get(path, requestParams, force).pipe(
      mergeMap((result: ApiResponse) => {
        if (result.isSucceeded === true || true) {
          return of(result);
        } else {
          if (doNotThrowError) {
            return of(result);
          } else {
            return throwError(result);
          }
        }
      }),
      catchError((error) => {
        if (doNotThrowError) {
          const result = this.returnErrorJson(error);
          return of(result);
        } else {
          return this.handleError(error, handleError);
        }
      })
    );
  }

  /**
   * Run a POST api call
   * @param actionName
   * @param requestParams
   * @param handleError
   * @return Observable<any>
   */
  private apiPost(actionName: string, requestParams: any = {}, handleError: boolean = true): Observable<any> {
    return this.post(actionName, requestParams).pipe(
      switchMap((result: ApiResponse) => {
        if (result.isSucceeded === true) {
          return of(result.content);
        } else {
          return throwError(result);
        }
      }),
      catchError((error) => {
        return this.handleError(error, handleError);
      })
    );
  }

  /**
   * Run a PUT api call
   * @param actionName
   * @param requestParams
   * @param handleError
   * @return Observable<any>
   */
  private apiPut(actionName: string, requestParams: any = {}, handleError: boolean = true): Observable<any> {
    return this.put(actionName, requestParams).pipe(
      mergeMap((result: ApiResponse) => {
        if (result.isSucceeded === true) {
          return of(result.content);
        } else {
          return throwError(result);
        }
      }),
      catchError((error) => {
        return this.handleError(error, handleError);
      })
    );
  }

  /**
   * Run a DELETE api call
   * @param actionName
   * @param requestParams
   * @param handleError
   * @return Observable<any>
   */
  private apiDelete(actionName: string, requestParams: any = {}, handleError: boolean = true): Observable<any> {
    return this.delete(actionName, requestParams).pipe(
      mergeMap((result: ApiResponse) => {
        if (result.isSucceeded === true) {
          return of(result.content);
        } else {
          return throwError(result);
        }
      }),
      catchError((error) => {
        return this.handleError(error, handleError);
      })
    );
  }

  protected setCustomHeaders(headers: HttpHeaders) {
    // todo
  }

  // API CALLS
  public getTranslation() {
    const fileName = 'he';

    return this.http.get(`${environment.translationPath}${fileName}.json`);
  }

  public getConfig() {
    return this.http.get(`${environment.configPath}`);
  }



  public getBranches(params = {}, force: boolean = true) {
    return this.apiGet('../assets/stubs/mockData.json', {}, true);
  }

  public getFilters(params = {}, force: boolean = true) {
    return this.apiGet('../assets/stubs/filters.json', {}, true);
  }

  public getGetCurrentTimeStamp(params = {}, force: boolean = true) {
    return this.apiGet('../assets/stubs/GetCurrentTimeStamp.json', {}, true);
  }




  /**
   * Handle API errors
   * @param error
   * @param handleError
   */
  protected handleError(error, handleError = true): Observable<any> {
    // if (handleError) {
    //
    // }
    let err: ApiError = error;
    if (!error || !error.errors) {
      err = {
        code: 0,
        message: ''
      };
    } else {
      err = error.errors;
    }
    return throwError(err);
  }

  protected returnErrorJson(error) {
    const result = {
      isSucceeded: false,
      error: null
    };
    let err: ApiError = error;
    if (!error || !error.errors) {
      err = {
        code: 0,
        message: ''
      };
    } else {
      err = error.errors;
    }

    result.error = err;

    return result;
  }

}
