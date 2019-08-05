import {Injectable} from '@angular/core';
import {RcEventBusService, RcTranslateService} from '@realcommerce/rc-packages';
import {TimeService} from './time-service';
import {AppService} from './app.service';
import {BranchHours} from '../interface/branch-hours';
import {isNullOrUndefined} from 'util';
import {BranchObj} from '../models/branch-model';
import {BranchSummarize} from '../models/branch-summarize-model';
import {HoursService} from './hours.service';
import {CONSTANTS} from '../../constants';
import {FilterBranchPipe} from '../filters/branch-filter.pipe';
import {BranchFilterService} from './branch-filter.service';


@Injectable({
  providedIn: 'root'
})
export class BranchDataService {
  private config = this.appService.appConfig;

  constructor(private translate: RcTranslateService, private timeService: TimeService, private appService: AppService, private hursService: HoursService, private pipe: FilterBranchPipe, private filterService: BranchFilterService, private  events: RcEventBusService) {
    const curTime = this.hursService.time;

  }

  branchNewArray: Array<object>;
  branchNewArrayFilter: Array<object>;

  get branchesFilter() {
    // console.log('?????', this.branchNewArrayFilter);
    return this.branchNewArrayFilter;
  }

  set branchesFilter(branches) {
    this.branchNewArrayFilter = branches;
  }

  initBrnchesAndMap(branches) {
    this.branchNewArray = branches;
    this.branchNewArrayFilter = this.pipe.transform(this.branchNewArray, []);
    this.events.on(CONSTANTS.EVENTS.UPDATE_FILTER, (filters) => {
      this.branchesFilter = this.pipe.transform(this.branchNewArray, filters);
    });


  }

  private replaceNullOrUndefinedInEmpty(val) {
    const str = isNullOrUndefined(val) || val === 'null' ? '' : val;
    return str;
  }

  private craeteBrancServices(services) {

    return services.filter((value) => {
      return value.serviceSwitch === CONSTANTS.yes;
    });
  }

  private onlyServicesTypeArray(services) {
    return services.map(obj => {
      return obj.branchServiceTypeCode;
    });
  }

  private craeteContactAddressFax(contactAddress) {

    const contactAddressFax = contactAddress.filter((value) => {
      return value.contactChannelTypeCode === CONSTANTS.HAVE_FAX;
    });
    if (!contactAddressFax.length) {
      return '';
    }
    return (!isNullOrUndefined(contactAddressFax[0].contactAddressInfo) ? contactAddressFax[0].contactAddressInfo : '');
  }

  createSingleBranch(data) {

    const isBankat = data.channelsGroupCode === CONSTANTS.BANKAT;
    const hours: any = this.hursService.createOpeningAndClosingHours(data.availability.availabilityStandard.weekDaysSpecification, false, isBankat);
    const address = data.geographicAddress[0];
    const fax = this.craeteContactAddressFax(data.contactAddress);
    const comma = this.replaceNullOrUndefinedInEmpty(address.streetName) || this.replaceNullOrUndefinedInEmpty(address.buildingNumber) ? ',' : '';
    const branchData = {

      branchNum: data.branchNumber,
      branchName: data.branchName,
      address: this.replaceNullOrUndefinedInEmpty(address.streetName) + ' ' + this.replaceNullOrUndefinedInEmpty(address.buildingNumber) + comma + ' ' + this.replaceNullOrUndefinedInEmpty(address.cityName),
      distanceInKm: data.geographicAddress[0].distanceInKm,
      openAndCloseHours: hours,
      branchService: this.craeteBrancServices(data.branchService),
    };

    const branchSummarize = new BranchSummarize(branchData.branchNum, branchData.branchName, branchData.address,
      branchData.distanceInKm, branchData.openAndCloseHours);
    return {
      isBankat: isBankat,
      branchSummarize: branchSummarize,
      branchService: branchData.branchService,
      fax: fax,
      phone: CONSTANTS.PHONE,
      branchManagerName: data.branchManagerName,
      comment: data.comment,
      servicesType: this.onlyServicesTypeArray(branchData.branchService),
    };
  }

  createDataArray(branchData: Array<any>) {
    if (isNullOrUndefined(branchData)) {
      return;
    }
    const branchNewArray = [];
    branchData.forEach(obj => {
      const branchFetched = this.createSingleBranch(obj);
      branchNewArray.push(new BranchObj(branchFetched.isBankat, branchFetched.branchSummarize, branchFetched.branchService, branchFetched.fax,
        branchFetched.phone, branchFetched.branchManagerName, branchFetched.comment, branchFetched.servicesType));
    });
    return branchNewArray;
  }


}


