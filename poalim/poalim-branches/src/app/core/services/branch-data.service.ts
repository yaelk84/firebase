import {Injectable} from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time-service';
import {AppService} from './app.service';
import {BranchHours} from '../interface/branch-hours';
import {isNullOrUndefined} from 'util';
import {BranchObj} from '../models/branch-model';
import {BranchSummarize} from '../models/branch-summarize-model';
import {HoursService} from './hours.service';
import {CONSTANTS} from '../../constants';


@Injectable({
  providedIn: 'root'
})
export class BranchDataService {
  private config = this.appService.appConfig;

  constructor(private translate: RcTranslateService, private timeService: TimeService, private appService: AppService, private hursService: HoursService) {
    const curTime = this.hursService.time;
    const dayName = this.timeService.getDayName(curTime);
    const tomarrowDay = this.timeService.addDays(1, curTime);
    const afterTomarrowDay = this.timeService.addDays(2, curTime);

  }



  private returnOpenHoursForCurrentDay(dayObject, currentTime, waasChange) {
    let hours = {morninigHours: '', nooonHours: ''};
    if (isNullOrUndefined(dayObject)) {
      return hours;
    }
    if (dayObject.field_bod_close_hour) {
      const currentHours = this.timeService.hoursDiff(currentTime, dayObject.field_bod_close_hour) > 0;
      if (currentHours) {
        hours.morninigHours = dayObject.field_bod_open_hours + '  - ' + dayObject.field_bod_close_hour;

      }
    }
    if (dayObject.field_bod_noon_close) {
      const currentHoursNoon = this.timeService.hoursDiff(currentTime, dayObject.field_bod_noon_close) > 0;
      if (currentHoursNoon) {
        hours.nooonHours = dayObject.field_bod_noon_open + ' - ' + dayObject.field_bod_noon_close;
      }
    }
    return hours;
  };


  private  replaceNullOrUndefinedInEmpty(val) {
    const  str = isNullOrUndefined(val) || val === 'null' ? '' : val;
    return str;
  }
  private  craeteBrancServices(services) {

    return services.filter((value) => {
       return value.serviceSwitch === CONSTANTS.yes ;
    });
     }
   private onlyServicesTypeArray(services){
    return  services.map(obj =>{
             return obj.branchServiceTypeCode;
     })
   }
  private  craeteContactAddressFax(contactAddress) {
    const contactAddressFax = contactAddress.filter((value) => {
      return value.contactChannelTypeCode === CONSTANTS.HAVE_FAX ;
    });
    if(!contactAddressFax.length){return ''}
    return (!isNullOrUndefined(contactAddressFax[0].contactAddressInfo) ? contactAddressFax[0].contactAddressInfo : '' );
  }
  createSingleBranch(data) {

    const isBankat = data.channelGroupCode ===  CONSTANTS.BANKAT;
    const hours: any = this.hursService.createOpeningAndClosingHours(data.availability.availabilityStandard.weekDaysSpecification , false , isBankat );
    const address = data.geographicAddress[0];
    const fax = this.craeteContactAddressFax(data.contactAddress);
    const branchData = {

      branchNum: data.branchNumber,
      branchName: data.branchName,
      address: this.replaceNullOrUndefinedInEmpty(address.cityName) + ' ' + this.replaceNullOrUndefinedInEmpty(address.streetName) +' ' + this.replaceNullOrUndefinedInEmpty(address.buildingNumber),
      distanceInKm: 0,
      openAndCloseHours: hours,
      branchCity: this.replaceNullOrUndefinedInEmpty(address.cityName),
      branchService: this.craeteBrancServices(data.branchService),

            };

      const branchSummarize = new BranchSummarize(branchData.branchNum, branchData.branchName, branchData.address,
      branchData.distanceInKm, branchData.openAndCloseHours);
         return{
        isBankat: data.channelGroupCode ===  CONSTANTS.BANKAT,
        branchSummarize: branchSummarize,
        branchService:  branchData.branchService,
        fax: fax,
        phone: CONSTANTS.PHONE,
        branchManagerName: data.branchManagerName,
        comment: data.comment,
        servicesType: this.onlyServicesTypeArray(branchData.branchService)
      };
  }


}


