import { Injectable } from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';



@Injectable({
  providedIn: 'root'
})
export class BranchDataService {

  constructor(private translate: RcTranslateService) { }

  createSingleBranch(data){
    console.log('data',this.translate.getText('branches'));
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


