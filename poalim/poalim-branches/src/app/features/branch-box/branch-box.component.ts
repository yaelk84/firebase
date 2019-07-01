import {Component, Input, OnInit} from '@angular/core';



@Component({
  selector: 'app-branch-box',
  templateUrl: './branch-box.component.html',
  styleUrls: ['./branch-box.component.scss']
})
export class BranchBoxComponent implements OnInit {

  constructor() { }
  @Input() branchData: any;
  ngOnInit() {


  }

}
