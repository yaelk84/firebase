import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-report-problem-popup',
  templateUrl: './report-problem-popup.component.html',
  styleUrls: ['./report-problem-popup.component.scss']
})
export class ReportProblemPopupComponent implements OnInit {

  reportBadServiceToggle = false;
  isSendBtnClicked = false;
  @Output() isModalOpen = new EventEmitter();
  @Input() rcPopupWrapperComponent: any;

  constructor() { }

  ngOnInit() {
  }

  reportBadHours() {
    console.log('report bad hours');
  }

  reportBadAddress() {
    console.log('report bad Address');
  }

  sendServiceReport(serviceReportInput) {
    console.dir(serviceReportInput);
    this.isSendBtnClicked = true;
  }

  closeModal() {
    this.isModalOpen.emit();
  }

}
