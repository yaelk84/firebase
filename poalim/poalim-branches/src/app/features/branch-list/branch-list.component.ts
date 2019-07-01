import {Component, OnInit, Input} from '@angular/core';
import {BranchObj} from '../../core/models/branch-model';
import {BranchDataService} from '../../core/services/branch-data.service';
import {ApiService} from '../../core/services/api.service';
import {catchError, map, mergeMap} from 'rxjs/operators';


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  constructor(private branchDataServices: BranchDataService, private apiService: ApiService) {
  }

  data;
  branchNewArray: BranchObj[] = [];

  ngOnInit() {

    return this.apiService.getBranches().subscribe((response) => {
      debugger
      response.data.forEach(obj => {
        const branchFetched = this.branchDataServices.createSingleBranch(obj);
        this.branchNewArray.push(new BranchObj(branchFetched.id, branchFetched.branchNum, branchFetched.branchName, branchFetched.address,
          branchFetched.distance, branchFetched.openAndCloseHours , branchFetched.openNow, branchFetched.change));
      });

      console.log('fff',  this.branchNewArray );


    });


  }

}
