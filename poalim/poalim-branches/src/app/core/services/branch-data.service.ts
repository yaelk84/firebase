import { Injectable } from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time-service';
import {AppService} from './app.service'




@Injectable({
  providedIn: 'root'
})
export class BranchDataService {
  private config = this.appService.appConfig;
  constructor(private translate: RcTranslateService, private timeService: TimeService, private appService: AppService  ) {
    const curTime = this.timeService.getCurrentTime();
    const dayName = this.timeService.getDayName(curTime);
    const  tomarrowDay = this.timeService.addDays(1, curTime);
    const  afterTomarrowDay = this.timeService.addDays(2, curTime);

  }

  private convertHoursToObject(data: any) {
    let daysObject :any={};
    data.forEach(obj => {
      const key = this.config.daysHe[obj.field_bod_day];
        daysObject[key] = obj;
    });
    return daysObject;
   };
  private createOpeningHours(dataObj) {
    let daysObject = [];

  }

  createSingleBranch(data) {
    let houresObj = this.convertHoursToObject(data.field_branch_open_days);
    let hours = this.createOpeningHours(houresObj);
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


