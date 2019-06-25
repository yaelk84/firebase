import { Injectable } from '@angular/core';
import { BRANCHESDATA } from '../../data/mock-branches';

@Injectable({
  providedIn: 'root'
})
export class BranchDataService {

  constructor() { }

  getBranches() {
    const branchesRaw = BRANCHESDATA;
    const newBranches = [];
    branchesRaw.forEach(branchRaw, ()=>{
      new BranchModel(branchesRaw.id, branchesRaw.name);
    })
  }
}
