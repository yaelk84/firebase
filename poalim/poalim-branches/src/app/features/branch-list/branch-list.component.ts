import { Component, OnInit,Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BRANCHESDATA } from '../../data/mock-branches';
import {BranchBox} from "../../core/interface/branch-box";
import {BranchObj} from "../../core/models/branch-model";
import {BranchDataService} from "../../core/services/branch-data.service";


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.sass']
})
export class BranchListComponent implements OnInit {
  constructor(private branchDataServices:BranchDataService) { }
  data;
  observableData;
  branchNewArray:BranchObj[]=[];
  branchFetched:BranchObj;
  ngOnInit() {
    /** replace with http after**/
    this.data=BRANCHESDATA;
    this.observableData = Observable.create((observer) => {
       observer.next( this.data[0]);
      observer.next( this.data[1]);
      observer.complete();
    });
    /** end replace with http after**/
    this.observableData.subscribe(val =>{
      debugger;
      const branchFetched=this.branchDataServices.createSingleBranch(val);
      this.branchNewArray.push(new BranchObj(branchFetched.id,branchFetched.branchNum,branchFetched.branchName,branchFetched.address,branchFetched.distance,branchFetched.openHours,branchFetched.closeHours,branchFetched.closeNow,branchFetched.change));
  }
    );
    console.log(this.branchNewArray,"branchNewArray");
  }

}
