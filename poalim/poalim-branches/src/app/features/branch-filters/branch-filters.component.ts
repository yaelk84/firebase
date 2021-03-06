import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {CONSTANTS} from '../../constants';
import {DeviceService} from '../../core/services/device.service';
import {FormControl} from '@angular/forms';
import {ApiService} from '../../core/services/api.service';
import {isNullOrUndefined} from 'util';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {BranchDataService} from '../../core/services/branch-data.service';
import {AppService} from "../../core/services/app.service";


@Component({
  selector: 'app-branch-filters',
  templateUrl: './branch-filters.component.html',
  styleUrls: ['./branch-filters.component.scss']
})
export class BranchFiltersComponent implements OnInit {
  arrayOfActiveFilterIds = [];
  branchFiltersWithIcon;
  checkBoxValues: any;
  openDropDown = false;
  openPOPup = false;
  dropDownCheckLength = 0;


  @Input() activeFilters;
  @ViewChild('filterBox') filterBox: ElementRef;


  constructor(private filterService: BranchFilterService, private deviceService: DeviceService, private  apiService: ApiService,
              private mapService: MapBranchesService, private branchDataServices: BranchDataService, private appService: AppService) {
  }

  public formControl = new FormControl();

  closePopup() {
    if (this.mapService.hasLocationPermission) {
      this.openPOPup = false;
    }
  }

  closeDropDownServices() {
    this.openDropDown = false;
  }

  getActiveCheckBox() {
    return this.checkBoxValues.filter(key => {
      return (key.formControl && key.formControl.value === true);
    });
  }

  privateUpdateNum() {
    this.dropDownCheckLength = this.getActiveCheckBox().length;

  }

  toggleFilter(id: string, defaultVal?) {
    this.filterService.toggleFilter(id, defaultVal);
    this.arrayOfActiveFilterIds = this.filterService.activeFilters;
    this.mapService.isSearchHereButtonClicked = false;
    if (this.filterBox && this.mapService.hasLocationPermission) {
      this.filterBox.nativeElement.focus();
    }
  }

  togglePluse(e?: Event) {


    if (!isNullOrUndefined(e)) {
      e.stopPropagation();
    }

    if (this.deviceService.isMobile()) {
      this.openPOPup = !this.openPOPup;
    } else {

      this.openDropDown = !this.openDropDown;
    }
    if (this.openPOPup || this.openDropDown) {
    // solution for case that user check service and close the popup without submit'next time this service wont show
      this.checkBoxValues.forEach(checkbox => {
        const haveVal = this.filterService.activeFilters.indexOf(checkbox.key) > -1;
        checkbox.formControl.setValue(haveVal ? true : null);
      });
    }
  }

  dropDownSelected() {
    this.privateUpdateNum();
    this.filterService.removeFilterCheckBoxValues(this.checkBoxValues);
    this.filterService.addFiltersCheckBoxValues(this.getActiveCheckBox());
    this.togglePluse();
  }

  popupSelected() {
    this.privateUpdateNum();
    this.filterService.removeFilterCheckBoxValues(this.checkBoxValues);
    this.filterService.addFiltersCheckBoxValues(this.getActiveCheckBox());
    this.openPOPup = true;
    this.togglePluse();
  }

  getNumberPfBOxesBySize() {
    if (this.deviceService.isXs()) {
      return CONSTANTS.BRANCH_FILTER_NUM.MOBILE;
    } else if (this.deviceService.isSm() || this.deviceService.isMd()) {
      return CONSTANTS.BRANCH_FILTER_NUM.TABLET;
    }
    return CONSTANTS.BRANCH_FILTER_NUM.DESKTOP;
  }

  updateBranchAfterChangeMap() {

    /* check if need
      if ( !this.filterService.dirty) {
         this.filterService.removeFilterRadio(this.arrayOfActiveFilterIds);
         const defaultFilter = this.mapService.hasLocationPermission ? CONSTANTS.FILTER_lOCATION : CONSTANTS.FILTER_OPEN_NOW;
         this.toggleFilter(defaultFilter , true);
       }*/

  }

  ngOnInit() {
    this.filterService.clearFilter();
    const size = this.getNumberPfBOxesBySize();
    return this.apiService.getFilters().subscribe((response) => {
      this.filterService.createFiltersByTypes(response);

      this.branchFiltersWithIcon = this.filterService.filters.slice(0, size);
      this.checkBoxValues = this.filterService.createCheckBoxArray(
        this.filterService.filters.slice(size + 1, this.filterService.filters.length));
      const defaultFilter = this.mapService.hasLocationPermission && !this.branchDataServices.citySelected.length ?
        CONSTANTS.FILTER_lOCATION : CONSTANTS.FILTER_OPEN_NOW;
      this.toggleFilter(defaultFilter, true);
      /* check if can delete */
    });
  }
}
