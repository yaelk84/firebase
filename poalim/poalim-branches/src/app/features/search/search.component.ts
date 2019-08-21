import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {RcEventBusService, RcValidators} from '@realcommerce/rc-packages';
import {BranchObj} from '../../core/models/branch-model';
import {BranchDataService} from '../../core/services/branch-data.service';
import {ApiService} from '../../core/services/api.service';
import {AppService} from '../../core/services/app.service';
import {MapBranchesService} from '../../core/services/map-branches.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GeoLocationObject} from '../../core/interface/coordinates';
import {isNullOrUndefined} from 'util';
import {BranchFilterService} from '../../core/services/branch-filter.service';
import {NgSelectComponent} from '@ng-select/ng-select';
import {CONSTANTS} from '../../constants';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})


export class SearchComponent implements OnInit {

  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  items: any[];
  selectedItem: any;
  filteredItems: any[];
  searchTerm: string;
  openDropdown: boolean;
  searchFocused: boolean;
  optionMouseOver: boolean;
  cities: [];


  constructor(private apiService: ApiService, private appService: AppService, private  router: Router, private  activeRoute: ActivatedRoute, private mapSEervice: MapBranchesService, private branchDataServices: BranchDataService, private filterServics: BranchFilterService, private events: RcEventBusService) {
  }

  set updateCities(data) {
    this.cities = data;
  }

  ngOnInit() {

    this.initSearch();
    this.events.on(CONSTANTS.EVENTS.DELETE_SEARCH, () => {
      this.clearFromOutside();
    }, true);

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

  clearFromOutside() {
    this.ngSelectComponent.handleClearClick();

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

  const UncheckLocationFilter = () => {

    if (this.filterServics.activeFilters.indexOf(CONSTANTS.FILTER_lOCATION) > -1) {
      this.filterServics.toggleFilter(CONSTANTS.FILTER_lOCATION);

    }


}
    if (isNullOrUndefined($event)) {
      this.branchDataServices.citySelected = '';
      this.router.navigate([], {queryParams: {}, relativeTo: this.activeRoute});
      return;
    }

    this.openDropdown = false;
    this.searchTerm = '';
    // todo: handle item selected
    const branchNumber = $event && $event.branchNumber ? $event.branchNumber : '';

     if ($event.type === 'branch') {
       UncheckLocationFilter();
      this.router.navigate([], {queryParams: {branch: branchNumber}, relativeTo: this.activeRoute});
      return;
    }

    if ($event.type === 'city') {
      UncheckLocationFilter();
         this.router.navigate([], {queryParams: {city: $event.name}, relativeTo: this.activeRoute});

    }


  }

  searchFn(term, item) {

    if (term.length < 3) {
      return false;
    }
    if (item.type === 'city') {
      return item.name.indexOf(term) > -1;
    } else {
      return item.branchName.indexOf(term) > -1 || item.geographicAddress[0].cityName.indexOf(term) > -1;
    }
  }


}
