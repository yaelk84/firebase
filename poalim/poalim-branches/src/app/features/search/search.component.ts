import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
  @Output() onMobileSearch = new EventEmitter();


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
    this.closeDropDown();
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
    this.onMobileSearch.emit({isSearchOpen: true});
    this.searchTerm = $event.term;
    this.sortFilteredItems($event.items);
    if ($event.term.length > 2) {
          this.openDropdown = true;
        } else {
          this.closeDropDown();
    }
  }


  shouldShow(item) {
    return this.filteredItems.indexOf(item) > -1;
  }

  sortFilteredItems(items) {
    const comma = ',';
    function replaceNullOrUndefinedInEmpty(val) {
      const str = isNullOrUndefined(val) || val === 'null' ? '' : val;
      return str;
    }
    function buildLabel(data) {
      const address = data.geographicAddress[0];
      return  replaceNullOrUndefinedInEmpty(address.cityName) +  comma + ' ' + replaceNullOrUndefinedInEmpty(address.streetName) + ' ' + replaceNullOrUndefinedInEmpty(address.buildingNumber) + '-' + replaceNullOrUndefinedInEmpty(data.branchName) + ' ' + '(' + data.branchNumber + ')';
    }

    const cities = [];
    const branches = [];
    for (const item of items) {
      if (item.type == 'city' && cities.length < 3) {
        cities.push(item);
      } else if (item.type == 'branch' && branches.length < 4) {
        item.addressToDisplay = buildLabel(item);
        item.kmToDisplay = parseFloat(item.geographicAddress[0].distanceInKm).toFixed(2);
        branches.push(item);
      }
    }
    this.filteredItems = cities.concat(branches).slice(0, CONSTANTS.MAX_RESULTS_DROP_DOWN);
  }

  onFocus($event) {
    this.searchFocused = true;
  }

  onBlur($event) {
    console.log($event);
    this.searchFocused = false;
    // this.openDropdown = false;

  }
  keyDoen(e) {
    if (e.which === 8 && !e.target.value.length) {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();

    }

  }
  onClear() {
    this.searchTerm = '';
    this.closeDropDown();
  }
  doSearch(ngSelectAutoComplete) {
    ngSelectAutoComplete.element.childNodes[2].children[0].getElementsByClassName('ng-option-marked')[0].click();
  //   console.log('MouseEvent', e);
  //   console.log('KeyboardEvent', enter);
  //   e.dispatchEvent(enter);
    // this.openDropdown = false;
  }
  onClose() {
    this.closeDropDown();
  }

  closeDropDown() {
    this.onMobileSearch.emit({isSearchOpen: false});
    this.openDropdown = false;
  }

  onChange($event) {
    this.closeDropDown();
    const UncheckLocationFilter = () => {

      if (this.filterServics.activeFilters.indexOf(CONSTANTS.FILTER_lOCATION) > -1) {
        this.filterServics.toggleFilter(CONSTANTS.FILTER_lOCATION);
      }
    };
    if (isNullOrUndefined($event)) {
      this.branchDataServices.citySelected = '';
      this.router.navigate([], {queryParams: {}, relativeTo: this.activeRoute});
      return;
    }

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
      const address = item.geographicAddress[0];
      return item.branchName
        .indexOf(term) > -1 || address.cityName
        .indexOf(term) > -1 ||  address.streetName
        .indexOf(term) > -1 || String(address.buildingNumber)
        .indexOf(term) > -1 ||  String(address.branchNumber)
        .indexOf(term) > -1;
    }
  }


}
