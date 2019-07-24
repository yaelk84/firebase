import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
// import {GeoLocationObject} from "../../core/interface/coordinates";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public activeFilters = [];
  public branches: Array<object> = null;

  constructor(private apiService: ApiService,  private mapBranches: MapBranchesService) { }

  ngOnInit() {
    this.apiService.getBranches().subscribe((data) => {
      this.branches = data;
    });
    this.mapBranches.getMyLocation().subscribe(res => {
      if (this.mapBranches.checkIfHaveLocation(res)) {
         this.mapBranches.hasLocationPermission = true;
      }
    }, (error1 => this.mapBranches.hasLocationPermission = false));
  }
}
