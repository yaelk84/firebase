import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-no-location-permissions',
  templateUrl: './no-location-permissions.component.html',
  styleUrls: ['./no-location-permissions.component.scss']
})
export class NoLocationPermissionsComponent implements OnInit {


  @Output() close = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  activateLocation() {
    console.log('activating location services');
  }

  dismiss() {
    this.close.emit();
  }

}
