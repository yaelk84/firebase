import {Component, Input, OnInit} from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';
import {HoursService} from '../../core/services/hours.service';


@Component({
  selector: 'app-branch-hours',
  templateUrl: './branch-hours.component.html',
  styleUrls: ['./branch-hours.component.scss']
})
export class BranchHoursComponent implements OnInit {
  typeHours : string ="";
  textHours : string ="";
  constructor(private translate: RcTranslateService , private hoursFunc: HoursService) { }
  @Input() hours: any;
  @Input() isSingleDisplay: boolean;
  ngOnInit() {
    this.hoursFunc.creatHoursWeekList(this.hours);
    debugger
    console.log("hours" , this.hours)
      if ( this.hours.Bankat){
      this.typeHours = 'Bankat';
    }
    else if ( this.hours.wasChange){
      this.typeHours = 'wasChange';
    }
    else {
      if (this.hours.openNow){
        this.typeHours = 'today';
      }
      else {
        this.typeHours = 'future-date';
        if ( this.hours.tomorrow){
          this.textHours = this.translate.getText('openTomarrow',[this.hours.openAt]);
        }
        else{
          this.textHours = this.translate.getText('openAnotherDay',[this.hours.dayName, this.hours.openAt]);
        }

      }


    }

  }

}
