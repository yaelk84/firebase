import { Component, OnInit } from '@angular/core';
import {BranchFilterService} from '../../core/services/branch-filter.service';

@Component({
  selector: 'app-branch-filters',
  templateUrl: './branch-filters.component.html',
  styleUrls: ['./branch-filters.component.scss']
})
export class BranchFiltersComponent implements OnInit {
  arrayOfActiveFilterIds: any[]=['1'];
  branchFiltersWithIcon;
  constructor( private filterService: BranchFilterService) { }
  toggleFilter(id:number) {
    debugger
       const indexOfId = this.arrayOfActiveFilterIds.indexOf(id )
    if ( indexOfId > -1) {
      this.arrayOfActiveFilterIds.splice(indexOfId, 1);
      this.arrayOfActiveFilterIds= this.arrayOfActiveFilterIds.concat([]);
    }
    else {
      debugger
      this.arrayOfActiveFilterIds=this.arrayOfActiveFilterIds.concat([id]);
    }
    this.filterService.updateActiveFilters(this.arrayOfActiveFilterIds);
  }
  ngOnInit() {
    const size= 7;//todo
    const branchFilters = this.filterService.createFiltersByTiypes();
    this.branchFiltersWithIcon = branchFilters.slice(0, size);
    console.log("filters", this.branchFiltersWithIcon)
  }


}
