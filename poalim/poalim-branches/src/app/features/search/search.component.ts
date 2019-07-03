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
  searchTerm: string;
  openDropdown: boolean;
  searchFocused: boolean;

  constructor() { }

  ngOnInit() {
    this.initSearch();
  }

  initSearch() {
    // todo: get the list of items from the api data
    this.items = [];
    this.openDropdown = false;
    for (let i = 0; i < 25; i++) {
      if (i % 3 == 0) {
        this.items.push({
          id: i,
          name: 'רון' + i,
          address: 'צל שדג רון שדג'
        });
      }
      else if (i % 2 == 0) {
        this.items.push({
          id: i,
          name: 'קפלן' + i,
          address: 'צל שדג קפלן שדג'
        });
      }
      else if (i % 5 == 0) {
        this.items.push({
          id: i,
          name: 'יעל' + i,
          address: 'צל שדג יעל שדג'
        });
      }
    }
  }

  onSearch($event) {
    this.searchTerm = $event.term;
    if ($event.term.length > 2) {
      this.openDropdown = true;
    } else {
      this.openDropdown = false;
    }
  }

  onFocus($event) {
    console.log($event);
    this.searchFocused = true;
  }

  onBlur($event) {
    console.log($event);
    this.searchFocused = false;
    this.openDropdown = false;

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
  }

  searchFn(term, item) {
    if (term.length < 3) return false;
    const flag = item.name.indexOf(term) > -1 || item.address.indexOf(term) > -1;
    return flag;
  }

}
