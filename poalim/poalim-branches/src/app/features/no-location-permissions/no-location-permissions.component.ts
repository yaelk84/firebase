import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-location-permissions',
  templateUrl: './no-location-permissions.component.html',
  styleUrls: ['./no-location-permissions.component.scss']
})
export class NoLocationPermissionsComponent implements OnInit {

  showBox = true;

  constructor() { }

  ngOnInit() {
  }

  activateLocation() {
    console.log('activating location services');
  }

  dismiss() {
    this.showBox = false;
  }

}
