import { Component, OnInit } from '@angular/core';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-branch-filters',
  templateUrl: './branch-filters.component.html',
  styleUrls: ['./branch-filters.component.scss']
})
export class BranchFiltersComponent implements OnInit {
  arrayOfActiveFilterIds: any[]=new Array();
  branchFiltersWithIcon;
  constructor( private filterService: BranchFilterService) { }

  toggleFilter(id:number) {
    this.filterService.toggleFilter(id);
    this.arrayOfActiveFilterIds=this.filterService.activeFilters;
  }
  ngOnInit() {
    const size= 7;//todo
    const branchFilters = this.filterService.createFiltersByTiypes();
    this.branchFiltersWithIcon = branchFilters.slice(0, size);



  }


}
