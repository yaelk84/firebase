import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {RcValidators} from '@realcommerce/rc-packages';
import {BranchObj} from '../../core/models/branch-model';
import {BranchDataService} from '../../core/services/branch-data.service';
import {ApiService} from '../../core/services/api.service';
import {AppService} from '../../core/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  items: any[];
  selectedItem: any;
  filteredItems: any[];
  searchTerm: string;
  openDropdown: boolean;
  searchFocused: boolean;
  optionMouseOver: boolean;
  cities: []


  constructor(private apiService: ApiService , private appService: AppService , private  router: Router, private  activeRoute: ActivatedRoute) { }
 set updateCities(data) {
    this.cities = data;
 }
  ngOnInit() {

    this.initSearch()

  }



  initSearch() {
    // todo: get the list of items from the api data and manipulate for autocomplete (for now using demo data from stub)
    //  need to sort by distance if possible, else sort by branch name -> street -> city (cities go first then branches)
    this.items = [];
    this.openDropdown = false;
    const tempBranches = this.appService.branches.map((obj) => {
      obj.type = 'branch';
      obj.name = obj.branchName;
      return obj;
    });
    const tempCities: any[] = [];
    this.appService.cities.map((obj) => {
         tempCities.push({type: 'city', nameLabel: '333333', name: obj});
         });

    this.items = tempCities.concat(tempBranches);

  }

  onSearch($event) {

    this.searchTerm = $event.term;
    this.sortFilteredItems($event.items);
    if ($event.term.length > 2) {
      this.openDropdown = true;
    } else {
      this.openDropdown = false;
    }
  }

  shouldShow(item) {
    return this.filteredItems.indexOf(item) > -1;
  }

  sortFilteredItems(items) {

    let cities = [];
    let branches = [];
    for (const item of items) {
      if (item.type == 'city' && cities.length < 3) {
        cities.push(item);
      } else if (item.type == 'branch' && branches.length < 4) {
        branches.push(item);
      }
    }
    this.filteredItems = cities.concat(branches);
  }

  onFocus($event) {
    console.log($event);
    this.searchFocused = true;
  }

  onBlur($event) {
    console.log($event);
    this.searchFocused = false;
    // this.openDropdown = false;

  }

  onClear() {
    this.searchTerm = '';
    this.openDropdown = false;
  }

  onClose() {
    this.openDropdown = false;
  }

  onChange($event) {

    console.log($event , 'select');
    this.openDropdown = false;
    this.searchTerm = '';
    // todo: handle item selected
    const  param  = $event && $event.branchNumber ? $event.branchNumber : "";
    if (param){
      this.router.navigate([], { queryParams: { branch: param } ,  relativeTo: this.activeRoute });
    }

  }

  searchFn(term, item) {

    if (term.length < 3) { return false; }
    if (item.type == 'city'){
      return item.name.indexOf(term) > -1;
    } else {
      return item.branchName.indexOf(term) > -1 || item.geographicAddress[0].cityName.indexOf(term) > -1;
    }
  }

}
