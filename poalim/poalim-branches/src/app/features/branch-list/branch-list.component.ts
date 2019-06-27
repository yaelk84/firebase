import {Component, OnInit, Input} from '@angular/core';
import {BRANCHESDATA} from '../../data/mock-branches';
import {BranchBox} from "../../core/interface/branch-box";
import {BranchObj} from "../../core/models/branch-model";
import {BranchDataService} from "../../core/services/branch-data.service";
import {ApiService} from '../../core/services/api.service';
import {logger} from "codelyzer/util/logger";
import {Observable, of, Subject, Subscription} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.sass']
})
export class BranchListComponent implements OnInit {
  constructor(private branchDataServices: BranchDataService,private apiService:ApiService) {
  }

  data;
  observableData;
  branchNewArray: BranchObj[] = [];
  branchFetched: BranchObj;

  ngOnInit() {
    /** replace with http after**/
    this.data = BRANCHESDATA;
    this.observableData = Observable.create((observer) => {
      observer.next(this.data[0]);
      observer.next(this.data[1]);
      observer.complete();
    });
debugger ;
    return this.apiService.getRoleDetails().subscribe((val) => {
      debugger
      console.log("response", val);
      const branchFetched = this.branchDataServices.createSingleBranch(val);
      this.branchNewArray.push(new BranchObj(branchFetched.id, branchFetched.branchNum, branchFetched.branchName, branchFetched.address, branchFetched.distance, branchFetched.openHours, branchFetched.closeHours, branchFetched.closeNow, branchFetched.change));
    });
    /** end replace with http after**/
  /*  this.observableData.subscribe((val) => {


      }, (err) => {
          console.log('err', err);
      }
    );*/
  }

}
