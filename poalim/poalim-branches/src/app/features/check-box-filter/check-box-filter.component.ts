import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-check-box-filter',
  templateUrl: './check-box-filter.component.html',
  styleUrls: ['./check-box-filter.component.scss']
})
export class CheckBoxFilterComponent implements OnInit {

  @Input() filterList :any[];
  @Output() valueChange = new EventEmitter();


  constructor() { }
  submitCheckboxes(){

    this.valueChange.emit();
  }
  ngOnInit() {

  }

}
