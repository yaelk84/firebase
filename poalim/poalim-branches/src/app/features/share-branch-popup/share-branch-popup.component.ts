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

  copyLink(item) {
    item = window.location.href;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    // const branchLinkToShare = window.location.href;
    // console.log('link to share !@#$%^&*', branchLinkToShare);
  }
  ShareBranchLinkByMail() {
    const clientMail = 'mailto:address@dmail.com';
    window.location.href = clientMail;
  }
}
