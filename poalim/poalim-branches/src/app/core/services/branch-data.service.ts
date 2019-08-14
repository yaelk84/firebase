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
  isSingleDisplay = false;
  isShowSnazzyInfoWindow = false;
  singleBranchToDisplay: object;
  citySelected = '';
  indexNoBankat = '';

  constructor(private translate: RcTranslateService, private timeService: TimeService, private appService: AppService, private hursService: HoursService, private pipe: FilterBranchPipe, private  events: RcEventBusService) {
  }

  branchNewArray: Array<object>;
  branchNewArrayFilter: Array<any>;

  /** setters ang getters */

  get branchesFilter() {
    return this.branchNewArrayFilter;
  }

  set branchesFilter(branches) {
    this.branchNewArrayFilter = branches;
    this.events.emit(CONSTANTS.EVENTS.REFRESH_LIST);
  }

  initBranchesAndApplyFilters(branches, filters) {
    this.branchNewArray = branches;
    this.branchesFilter = this.pipe.transform(this.branchNewArray, filters);
  }

  /**
   * update branchNewArray
   * @param branches Array
   */
  initBrnchesAndMap(branches) {
    this.branchNewArray = branches;
    this.branchNewArrayFilter = this.pipe.transform(this.branchNewArray, []); // called at first when no filters ywet
    this.events.on(CONSTANTS.EVENTS.UPDATE_FILTER, (filters) => {
      this.branchesFilter = this.pipe.transform(this.branchNewArray, filters);
    }, true);


  }

  /**
   * replace Null Or Undefined In Empty str
   * @param val String
   * return String
   */
  private replaceNullOrUndefinedInEmpty(val) {
    const str = isNullOrUndefined(val) || val === 'null' ? '' : val;
    return str;
  }

  /**
   * gett services from server that should show
   * @param services Array
   * return Array
   */
  private craeteBrancServices(services) {

    return services.filter((value) => {
      return value.serviceSwitch === CONSTANTS.yes;
    });
  }

  /**
   * create services array
   * @param services Array
   * return Array
   */
  private onlyServicesTypeArray(services) {
    return services.map(obj => {
      return obj.branchServiceTypeCode;
    });
  }

  /**
   * create address to display
   * @param contactAddress Array
   * return Array
   */
  private craeteContactAddressFax(contactAddress) {

    const contactAddressFax = contactAddress.filter((value) => {
      return value.contactChannelTypeCode === CONSTANTS.HAVE_FAX;
    });
    if (!contactAddressFax.length) {
      return '';
    }
    return (!isNullOrUndefined(contactAddressFax[0].contactAddressInfo) ? contactAddressFax[0].contactAddressInfo : '');
  }

  /**
   * add all needed data for single Beanch
   * @param data Object from mock data
   * return Object
   */
  createSingleBranch(data) {

    const isBankat = data.channelsGroupCode === CONSTANTS.BANKAT;
    const hours: any = this.hursService.createOpeningAndClosingHours(data.availability.availabilityStandard.weekDaysSpecification, false, isBankat);
    const address = data.geographicAddress[0];
    const fax = this.craeteContactAddressFax(data.contactAddress);
    const comma = this.replaceNullOrUndefinedInEmpty(address.streetName) || this.replaceNullOrUndefinedInEmpty(address.buildingNumber) ? ',' : '';
    const coords = {
      lat: data.geographicAddress[0].geographicCoordinate.geoCoordinateY,
      lng: data.geographicAddress[0].geographicCoordinate.geoCoordinateX
    };
    const cityName = data.geographicAddress[0].cityName;
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
      coords: coords,
      city: cityName,
      isBankat: isBankat,
      branchSummarize: branchSummarize,
      branchService: branchData.branchService,
      fax: fax,
      phone: CONSTANTS.PHONE,
      branchManagerName: data.branchManagerName,
      comment: data.comment,
      servicesType: this.onlyServicesTypeArray(branchData.branchService),
      isHovering: false,
      indexForDisplay: !isNullOrUndefined(data.indexForDisplay) ? String(data.indexForDisplay) : '0',

    };
  }

  /**
   * create array of branches
   * @param branchData Array
   * return Array
   */
  createDataArray(branchData: Array<any>) {
    if (isNullOrUndefined(branchData)) {
      return;
    }
    const branchNewArray = [];
    branchData.forEach(obj => {
      const branchFetched = this.createSingleBranch(obj);
      branchNewArray.push(new BranchObj(branchFetched.coords, branchFetched.isBankat, branchFetched.branchSummarize,
        branchFetched.branchService, branchFetched.fax, branchFetched.phone, branchFetched.branchManagerName, branchFetched.comment,
        branchFetched.servicesType, branchFetched.isHovering, branchFetched.indexForDisplay, branchFetched.city));
    });
    return branchNewArray;
  }


}


