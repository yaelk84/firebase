import { Component, OnInit,Input } from '@angular/core';

import { BRANCHESDATA } from '../../data/mock-branches';
import {BranchBox} from "../../core/interface/branch-box";


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.sass']
})
export class BranchListComponent implements OnInit {

  constructor() { }
  data: BranchBox[];
  ngOnInit() {
    console.log('BRANCHESDATA',BRANCHESDATA)
    this.data=BRANCHESDATA;
    console.log(' this.data', this.data)
  }

}
