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

  constructor(private translate: RcTranslateService ) { }
  @Input() hours: any;
  @Input() isSingleDisplay: boolean;
  ngOnInit() {


  }

}
