import { Injectable } from '@angular/core';
import {RcDeviceService} from '@realcommerce/rc-packages';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends RcDeviceService {

  constructor() {
    super();
  }

  /**
   * Check if current device is mobile
   * @return boolean
   */
  public isMobile(): boolean {

    return this.isMobileDeviceBySize() ;
  }
}

