import {Component, OnInit, Input} from '@angular/core';
import {BranchObj} from '../../core/models/branch-model';
import {BranchDataService} from '../../core/services/branch-data.service';
import {ApiService} from '../../core/services/api.service';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {FilterBranchPipe} from '../../core/filters/branch-filter.pipe';
import {RcEventBusService} from '@realcommerce/rc-packages';
import {CONSTANTS} from '../../constants';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  constructor(private branchDataServices: BranchDataService, private apiService: ApiService,
              private branchFilterService: BranchFilterService, private pipe: FilterBranchPipe, private events: RcEventBusService) {
  }

  data;
  branchNewArray: BranchObj[] = [];
  filters = [];
  branchNewArrayFilter: BranchObj[] = [];
  public formControl = new FormControl();

  ngOnInit() {
    this.events.on(CONSTANTS.EVENTS.UPDATE_FILTER, (filters) => {
      console.log('update', filters);
      const activeFilter = this.branchFilterService.getActiveFilters();
      console.log('activeFilters !!!!!!', activeFilter);
      this.branchNewArrayFilter = this.pipe.transform(this.branchNewArray, activeFilter);
    });

    this.filters = this.branchFilterService.filters;
    return this.apiService.getBranches().subscribe((response) => {
      response.forEach(obj => {
        const branchFetched = this.branchDataServices.createSingleBranch(obj);
        this.branchNewArray.push(
          new BranchObj(branchFetched.id, branchFetched.branchSummarize, branchFetched.branchService, branchFetched.fax,
            branchFetched.phone));
      });
      this.branchNewArrayFilter = this.pipe.transform(this.branchNewArray, []);
    });
  }

}
