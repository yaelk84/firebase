import {Component, Input, OnInit} from '@angular/core';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {CONSTANTS} from '../../constants';
import {DeviceService} from "../../core/services/device.service";
import {FormControl} from '@angular/forms';
import {FunctionsService} from "../../core/services/functions.service";



@Component({
  selector: 'app-branch-filters',
  templateUrl: './branch-filters.component.html',
  styleUrls: ['./branch-filters.component.scss']
})
export class BranchFiltersComponent implements OnInit {
  arrayOfActiveFilterIds: any[]=new Array();
  branchFiltersWithIcon;
  checkBoxValues: any;
 

  @Input() activeFilters;


  constructor( private filterService: BranchFilterService,private deviceService: DeviceService) { }
  public formControl = new FormControl();
  toggleFilter(id:number) {
    this.filterService.toggleFilter(id);
    this.arrayOfActiveFilterIds=this.filterService.activeFilters;
  }
  dropDownSelected(){
      console.log('obj');
  }
  ngOnInit() {
    const size=this.deviceService.isMobile()?CONSTANTS.BRANCH_FILTER_NUM.MOBILE:CONSTANTS.BRANCH_FILTER_NUM.DESKTOP;
    //btn filter
    const branchFilters = this.filterService.createFiltersByTypes();
    this.branchFiltersWithIcon = branchFilters.slice(0, size);
    // dropdown filter

    this.checkBoxValues = this.filterService.createCheckBoxArray(branchFilters.slice(size+1,branchFilters.length));








  }


}
