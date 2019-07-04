import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {RcValidators} from '@realcommerce/rc-packages';

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

  constructor() { }

  ngOnInit() {
    this.initSearch();
  }

  initSearch() {
    // todo: get the list of items from the api data and manipulate for autocomplete (for now using demo data)
    //  need to sort by distance if possible, else sort by branch name -> street -> city (cities go first then branches)
    this.items = [];
    this.openDropdown = false;
    let tempCities = [];
    let tempBranches = [];
    for (let i = 0; i < 25; i++) {
      if (i % 2 == 0) {
        tempCities.push({
          id: i,
          name: 'רון' + i,
          address: 'צל שדג רון שדג',
          type: 'city'
        });
      } else if (i % 3 == 0) {
        tempBranches.push({
          id: i,
          name: 'קפלן' + i,
          address: 'צל שדג רון שדג',
          type: 'branch'
        });
      } else if (i % 5 == 0) {
        tempBranches.push({
          id: i,
          name: 'יעל' + i,
          address: 'צל שדג רון שדג',
          type: 'branch'
        });
      }

      this.items = tempCities.concat(tempBranches);
    }
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
    console.log($event);
    this.openDropdown = false;
    this.searchTerm = '';
    // todo: handle item selected
  }

  searchFn(term, item) {
    if (term.length < 3) { return false; }
    const flag = item.name.indexOf(term) > -1 || item.address.indexOf(term) > -1;
    return flag;
  }

}
