import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-single-branch-display',
  templateUrl: './single-branch-display.component.html',
  styleUrls: ['./single-branch-display.component.scss']
})
export class SingleBranchDisplayComponent implements OnInit {

  constructor() { }

  @Input() dataBranchSelected: any;
  @Input() selectedIndex: number;


  ngOnInit() {

    console.log("init",this.dataBranchSelected)
  }

}
