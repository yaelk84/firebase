import { Injectable } from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time-service';



@Injectable({
  providedIn: 'root'
})
export class BranchDataService {

  constructor(private translate: RcTranslateService, private timeService: TimeService ) {
    const curTime = this.timeService.getCurrentTime();
    const dayName = this.timeService.getDayName(curTime);
    const  tomarrowDay = this.timeService.addDays(1, curTime);
    const  afterTomarrowDay = this.timeService.addDays(2, curTime);

  }

  private perapeHoursArray(data: any) {
    let daysObject :any={};
    data.forEach(obj => {
      const key = daysObject[obj.field_bod_day] = obj;
    });
    return daysObject;
   }
  private createHours() {

  }

  createSingleBranch(data) {
    this.perapeHoursArray(data.field_branch_open_days);
    return{id: 1,
      branchNum: data.field_branch_num,
      branchName: data.field_branch_latlon.name,
      address:data.name+" "+data.field_branch_street,
      distance:this.translate.getText('branches'),
      openHours:"10:00",
      closeHours:"22:00",
      closeNow:true,
      change:false};
  }



}


