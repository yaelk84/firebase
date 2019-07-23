import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {RcValidators} from '@realcommerce/rc-packages';
import {BranchObj} from '../../core/models/branch-model';
import {BranchDataService} from '../../core/services/branch-data.service';
import {ApiService} from '../../core/services/api.service';
import {forkJoin} from 'rxjs';

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

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // this.apiService.getBranches().subscribe((response) => {
    //
    // });
    this.loadData();

  }

  loadData() {
    forkJoin(this.apiService.getBranches()/*, promise2() todo: add cities getData*/)
      .subscribe(results => {

        const [branchesData /*, promise2Result*/] = results;
        this.initSearch(branchesData);
      });
  }

  initSearch(branchesData) {
    // todo: get the list of items from the api data and manipulate for autocomplete (for now using demo data from stub)
    //  need to sort by distance if possible, else sort by branch name -> street -> city (cities go first then branches)
    this.items = [];
    this.openDropdown = false;
    let tempBranches = [];
    let tempCities = [];
    for (let i = 0; i < 25; i++) {
      if (i % 2 == 0) {
        tempCities.push({
          id: i,
          name: 'אשדוד' + i,
          type: 'city'
        });
      }
      else if (i % 3 == 0) {
        tempCities.push({
          id: i,
          name: 'באר שבע' + i,
          type: 'city'
        });
      }
      else if (i % 7 == 0) {
        tempCities.push({
          id: i,
          name: 'חולון' + i,
          type: 'city'
        });
      }
    }
    for (const branch of branchesData) {
      tempBranches.push({
        id: branch._id,
        type: 'branch',
        name: branch.branchName,
        address: branch.geographicAddress.streetName + ' ' + branch.geographicAddress.buildingNumber + ', ' + branch.geographicAddress.cityName
      });
    }
    this.items = tempCities.concat(tempBranches);

  }

  onSearch($event) {
    debugger
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
    debugger
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
    debugger
    console.log($event);
    this.openDropdown = false;
    this.searchTerm = '';
    // todo: handle item selected
  }

  searchFn(term, item) {
    debugger
    if (term.length < 3) { return false; }
    if (item.type == 'city'){
      return item.name.indexOf(term) > -1;
    } else {
      return item.name.indexOf(term) > -1 || item.address.indexOf(term) > -1;
    }
  }

}
