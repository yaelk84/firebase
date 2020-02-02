import {Component, EventEmitter, OnInit, Output, AfterViewInit, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-no-location-permissions',
  templateUrl: './no-location-permissions.component.html',
  styleUrls: ['./no-location-permissions.component.scss']
})
export class NoLocationPermissionsComponent implements OnInit, AfterViewInit {


  @Output() close = new EventEmitter();
  @ViewChild('titlePopup') titlePopup: ElementRef<HTMLElement>;
  constructor() {
  }

  ngOnInit() {
  }

  activateLocation() {
    console.log('activating location services');
  }
  ngAfterViewInit() {
   this.titlePopup.nativeElement.focus();
  }
  dismiss() {
    this.close.emit();
  }

}
