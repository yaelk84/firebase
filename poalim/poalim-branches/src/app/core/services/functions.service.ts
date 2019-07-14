import { Injectable } from '@angular/core';
import {RcFunctionsService} from '@realcommerce/rc-packages';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService extends RcFunctionsService {

  constructor() {
    super();
  }


  convertObjToArray(obj,keyName:string):any [] {
    const arrayFromObj = Object.keys(obj).map(key => ({[keyName]: key, ...obj[key]}))
    return arrayFromObj;
  }

  converArrayToDropDown(arr):any [] {
    let dropDownValues:any[]=[];
     arr.forEach((val)=>{
      dropDownValues.push({key: val.type, value: val.text})
    })
    return dropDownValues;
  }
}

