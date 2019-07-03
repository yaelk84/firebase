import {Component, Input, OnInit} from '@angular/core';
import {RcTranslateService} from '@realcommerce/rc-packages';


@Component({
  selector: 'app-branch-hours',
  templateUrl: './branch-hours.component.html',
  styleUrls: ['./branch-hours.component.scss']
})
export class BranchHoursComponent implements OnInit {
  typeHours : string ="";
  textHours : string ="";
  constructor(private translate: RcTranslateService) { }
  @Input() hours: any;
  ngOnInit() {
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
