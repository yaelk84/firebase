import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {of} from 'rxjs';
import {ApiService} from '../../core/services/api.service';
import {HoursService} from '../../core/services/hours.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   activeFilters = [];
   servicesLoaded = false;
   openPopup = true;

  constructor( private  apiService: ApiService , private  hours: HoursService) { }

  ngOnInit() {
    console.log("on init")
    this.apiService.getGetCurrentTimeStamp()
      .subscribe((response) => {
          console.log( 'respose' , response)
          this.hours.updateTime  = response.time;
          this.servicesLoaded = true;

          return of({});
        });
  }

}
