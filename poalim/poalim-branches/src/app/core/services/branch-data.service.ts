import { Injectable } from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time.service';
import {Observable, of} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class BranchDataService {

  constructor(private translate: RcTranslateService, private timeService:TimeService ) { }



  createSingleBranch(data){

    return{id:1,
      branchNum:data.field_branch_num,
      branchName:data.field_branch_latlon.name,
      address:data.name+" "+data.field_branch_street,
      distance:this.translate.getText('branches'),
      openHours:"10:00",
      closeHours:"22:00",
      closeNow:true,
      change:false};
  }



}


