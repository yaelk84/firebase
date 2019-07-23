import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public activeFilters = [];
  public branches: Array<object> = null;

  constructor(public apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getBranches().subscribe((data) => {
      this.branches = data;
    });
  }

}
