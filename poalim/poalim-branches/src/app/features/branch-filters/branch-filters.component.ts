import {Component, Input, OnInit} from '@angular/core';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {CONSTANTS} from '../../constants';
import {DeviceService} from '../../core/services/device.service';
import {FormControl} from '@angular/forms';
import {ApiService} from '../../core/services/api.service';




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


  constructor( private filterService: BranchFilterService,private deviceService: DeviceService , private  apiService: ApiService) { }
  public formControl = new FormControl();
  closePopup() {

  }
  getActiveCheckBox(){
    return  this.checkBoxValues.filter(key =>{return (key.formControl && key.formControl.value=== true)})
  }
  privateUpdateNum(){
   this.dropDownCheckLength= this.getActiveCheckBox().length;

  }
  toggleFilter(id: string) {
    this.filterService.toggleFilter(id);
    this.arrayOfActiveFilterIds = this.filterService.activeFilters;
  }
  togglePluse(){

    if (this.deviceService.isMobile()){
      this.openPOPup = !this.openPOPup ;
    }
    else {
      this.openDropDown = !this.openDropDown;
    }
   }
  dropDownSelected(){
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
    const size=this.deviceService.isMobile()?CONSTANTS.BRANCH_FILTER_NUM.MOBILE:CONSTANTS.BRANCH_FILTER_NUM.DESKTOP;
    return this.apiService.getFilters().subscribe((response) => {
      this.filterService.createFiltersByTypes(response);
      this.branchFiltersWithIcon = this.filterService.filters.slice(0, size);

      this.checkBoxValues = this.filterService.createCheckBoxArray(this.filterService.filters.slice(size+1,this.filterService.filters.length));
      // dropdown filter


    })





  }


}
