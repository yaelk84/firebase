import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-share-branch-popup',
  templateUrl: './share-branch-popup.component.html',
  styleUrls: ['./share-branch-popup.component.scss']
})
export class ShareBranchPopupComponent implements OnInit {
  @Input() branchName: string;
  @Input() branchNum: number;

  constructor() { }

  ngOnInit() {
  }

}
