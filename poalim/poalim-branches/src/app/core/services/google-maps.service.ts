import {Injectable} from '@angular/core';
import {LazyMapsAPILoaderConfigLiteral} from '@agm/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsConfig implements LazyMapsAPILoaderConfigLiteral {
  public apiKey: string;
  public libraries: string[];
  public language: string;
  constructor() {
    const rootElement: any =  document.getElementsByTagName('app-root')[0];
    const branchApiCode = rootElement.dataset.branchKapi;
    this.apiKey = branchApiCode;
    this.language = 'iw';
    this.libraries = ['geometry', 'places']
  }
}


