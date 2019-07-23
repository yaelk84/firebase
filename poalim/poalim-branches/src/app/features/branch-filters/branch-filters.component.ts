import {Component, Input, OnInit} from '@angular/core';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {CONSTANTS} from '../../constants';
import {DeviceService} from '../../core/services/device.service';
import {FormControl} from '@angular/forms';
import {FunctionsService} from '../../core/services/functions.service';



@Component({
  selector: 'app-branch-filters',
  templateUrl: './branch-filters.component.html',
  styleUrls: ['./branch-filters.component.scss']
})
export class BranchFiltersComponent implements OnInit {
  arrayOfActiveFilterIds: any[] = new Array();
  branchFiltersWithIcon;
  checkBoxValues: any;
  openDropDown = false;
  openPOPup = false;
  dropDownCheckLength = 0;



  @Input() activeFilters;


  constructor( private filterService: BranchFilterService, private deviceService: DeviceService) { }
  public formControl = new FormControl();
  closePopup() {
    console.log('close');
  }
  getActiveCheckBox() {
    return  this.checkBoxValues.filter(key => (key.formControl && key.formControl.value === true));
  }
  privateUpdateNum() {
   this.dropDownCheckLength = this.getActiveCheckBox().length;

  }
  toggleFilter(id: number) {
    this.filterService.toggleFilter(id);
    this.arrayOfActiveFilterIds = this.filterService.activeFilters;
  }
  togglePluse() {
    // debugger;
    if (this.deviceService.isMobile()) {
      this.openPOPup = !this.openPOPup ;
    } else {
      this.openDropDown = !this.openDropDown;
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
  ngOnInit() {
    const size = this.deviceService.isMobile() ? CONSTANTS.BRANCH_FILTER_NUM.MOBILE : CONSTANTS.BRANCH_FILTER_NUM.DESKTOP;
    // btn filter
    const branchFilters = this.filterService.createFiltersByTypes();
    this.branchFiltersWithIcon = branchFilters.slice(0, size);
    // dropdown filter

    this.checkBoxValues = this.filterService.createCheckBoxArray(branchFilters.slice(size + 1, branchFilters.length));













  }


}
