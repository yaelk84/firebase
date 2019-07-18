import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-branch-box',
  templateUrl: './branch-box.component.html',
  styleUrls: ['./branch-box.component.scss']
})
export class BranchBoxComponent implements OnInit {


  constructor() {
  }

  @Input() branchData: any;
  @Input() branchIndex: number;
  @Input() filterByDay: boolean;
  @Output() branchClick = new EventEmitter();

  selectBranch(){

    this.branchClick.emit(this.branchIndex);
  }

  ngOnInit() {

console.log("inittt")

  }

}
