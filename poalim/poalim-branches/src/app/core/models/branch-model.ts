import {BranchSummarize} from './branch-summarize-model';
import {CONSTANTS} from '../../constants';

export class BranchObj {

  // private isHovering: boolean;

constructor(
            private coords:any,
            private  isBankat: boolean,
            public  branchSummarize: BranchSummarize,
            private  branchService: [],
            private  fax: string,
            private phone: string,
            private branchManagerName: string,
            private comment: string,
            private  serviceType: [],
            private isHovering: boolean,
             private indexForDisplay: string


) {
    this.isHovering = false;
  }
}

