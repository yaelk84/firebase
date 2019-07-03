import { Component, OnInit } from '@angular/core';
import {BranchFilterService} from './branch-filter.service';

@Component({
  selector: 'app-branch-filters',
  templateUrl: './branch-filters.component.html',
  styleUrls: ['./branch-filters.component.scss']
})
export class BranchFiltersComponent implements OnInit {
   branchFiltersWithIcon;
  constructor( private filterService: BranchFilterService) { }

  ngOnInit() {
    const size= 7;//todo
    const branchFilters = this.filterService.createFiltersByTipes();
    this.branchFiltersWithIcon = branchFilters.slice(0, size);
    console.log("filters", this.branchFiltersWithIcon)
  }

}
