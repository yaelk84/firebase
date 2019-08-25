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
    const branchLinkToShare = window.location.href;
    console.log('link to share !@#$%^&*', branchLinkToShare);
    let message;
    setTimeout(() => {
      message = document.createElement('sapn');
      const textNode = document.createTextNode('קישור הועתק בהצלחה!');
      message.appendChild(textNode);
      document.querySelector('.msg-container').appendChild(message);
    }, 250);
    // setTimeout(() => {
    //   message.style.display = 'none';
    // }, 1500);
  }
  ShareBranchLinkByMail() {
    const clientMail = 'mailto:address@dmail.com';
    window.location.href = clientMail;
  }
}
