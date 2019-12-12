import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CONSTANTS} from '../../constants';
import {RcTranslateService} from '@realcommerce/rc-packages';
import set = Reflect.set;

@Component({
  selector: 'app-report-problem-popup',
  templateUrl: './report-problem-popup.component.html',
  styleUrls: ['./report-problem-popup.component.scss']
})
export class ReportProblemPopupComponent implements OnInit {
  reportBadServiceToggle = false;
  isSendBtnClicked = false;
  infoType: string;
  description = '';
  @ViewChild('submitTrigger') submitTrigger: ElementRef;
  @Output() isModalOpen = new EventEmitter();
  @Input() rcPopupWrapperComponent: any;
  @Input() sendFormErrorType = CONSTANTS.ERROR_SEND_FORM.DONT_OPEN;
  @Input() branchNumber = '';
  @Input() branchName = '';
  unShrinkDiv = false;
  unShrinkDivType:'';
  constants = CONSTANTS;
  errorSendForm = false;
  unShrinkDivToggle(type){
    if(type !== this.unShrinkDivType){ //open another
      this.unShrinkDivType = type
      this.unShrinkDiv = true;
    }
    else{// click the same btn(toggle)
      this.unShrinkDiv = !this.unShrinkDiv;
    }

  }

  constructor(private translate: RcTranslateService) {
  }

  ngOnInit() {

    if (this.sendFormErrorType !== CONSTANTS.ERROR_SEND_FORM.DONT_OPEN) {
      this.isSendBtnClicked = true;
      if (this.sendFormErrorType !== CONSTANTS.ERROR_SEND_FORM.NO_ERROR) {
        this.errorSendForm = true;

      }
    }

  }
  submit() {
    setTimeout(() => {
      this.submitTrigger.nativeElement.click();
    }, 0);
  }

  reportBadHours() {

    this.infoType = this.translate.getText('badOpenHoursToSend');
    this.submit();

  }

  reportBadAddress() {

    this.infoType = this.translate.getText('badAddress');
    this.submit();

  }

  sendServiceReport(serviceReportInput) {
        this.description = serviceReportInput.value;
    this.infoType = this.translate.getText('badServices');
    this.submit();
    //console.dir(serviceReportInput);

  }
  closeModal() {
    this.isModalOpen.emit();
  }

}
