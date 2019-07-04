import {Component, OnInit, Input} from '@angular/core';
import {BranchObj} from '../../core/models/branch-model';
import {BranchDataService} from '../../core/services/branch-data.service';
import {ApiService} from '../../core/services/api.service';
import {BranchFilterService} from '../../core/services/branch-filter-service';
import {catchError, map, mergeMap} from 'rxjs/operators';



@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  constructor(private branchDataServices: BranchDataService, private apiService: ApiService,branchFilterService : BranchFilterService) {
  }

  data;
  branchNewArray: BranchObj[] = [];
  filters=branchFilterService.filters;
  activeFilters=branchFilterService.activeFilters;

  ngOnInit() {

    return this.apiService.getBranches().subscribe((response) => {
      response.forEach(obj => {
        const branchFetched = this.branchDataServices.createSingleBranch(obj);
        this.branchNewArray.push(new BranchObj(branchFetched.id, branchFetched.branchSummarize, branchFetched.branchService, branchFetched.fax,
          branchFetched.phone));
      });

      console.log('fff', this.branchNewArray);


    });


  }

}
