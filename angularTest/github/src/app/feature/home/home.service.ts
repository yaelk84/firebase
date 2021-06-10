import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {IResult, IServerDataItem} from '../../models/model';
import {ApiService} from '../../services/api.service';
import {CONSTANTS} from '../../constants';
import { NgModule } from '@angular/core';


export class HomeService {



  constructor(private apiService: ApiService) {
  }

  public githubSearch(searchKeyWord: string): Observable<IResult[]> {
    return this.apiService.githubSearch(searchKeyWord).pipe(
      mergeMap((response:IServerDataItem[]) => {
        const resultArray: IResult[] = [];
        response.forEach((item: IServerDataItem)=>{
          resultArray.push(this.convertServerItemToResultType(item))

        })
        return of(resultArray)
      })
    );
  }
  public addToBookMark(result: IResult){
    const localStorageBookMarket:IResult[] = JSON.parse(localStorage.getItem(CONSTANTS.BOOKMARKS));
    const bookmarks =localStorageBookMarket ? localStorageBookMarket: [];
    bookmarks.push(result);
    const distinct = bookmarks.filter(
      (thing, i, arr) => arr.findIndex(t => t.repoName === thing.repoName
      ) === i
    );

    localStorage.setItem(CONSTANTS.BOOKMARKS, (JSON.stringify(distinct)));


  }

  private  convertServerItemToResultType(serverItem: IServerDataItem): IResult{
    return {repoAvatar:serverItem.owner.avatar_url, repoName:serverItem.name}

  }

}
