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
import {DeviceService} from "../../core/services/event-service";


let currentSearchItemsCities = [];
let currentSearchItems = [];

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
  isAfterSelectBranch = false;
  cities: [];
  isMobile = false;
  @Output() onMobileSearch = new EventEmitter();
  @ViewChild('searchButton') searchButtonElem: ElementRef;

  constructor(private apiService: ApiService, private appService: AppService, private  router: Router,
              private  activeRoute: ActivatedRoute, private mapSEervice: MapBranchesService,
              private branchDataServices: BranchDataService, private filterServics: BranchFilterService,
              private events: RcEventBusService, private deviceService: DeviceService) {
  }

  set updateCities(data) {
    this.cities = data;
  }

  ngOnInit() {
    this.searchFocused = false;
    this.isMobile = this.deviceService.isMobile();
    this.initSearch();
    this.events.on(CONSTANTS.EVENTS.DELETE_SEARCH, () => {
      this.clearFromOutside();
    }, true);

  }


  initSearch() {
    this.items = [];
    currentSearchItemsCities = [];
    currentSearchItems = [];
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
    currentSearchItemsCities = [];
    currentSearchItems = [];
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
    if (!item) {
      return true;
    }
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

  onBlur() {
    this.searchFocused = false;
    // this.openDropdown = false;

  }
  // keyDoen(e) {
  //   if (e.which === 8 && !e.target.value.length) {
  //     e.stopImmediatePropagation();
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // }
  onClear() {
    this.searchTerm = '';
    this.closeDropDown();
  }
  doSearch(ngSelectAutoComplete) {

    if (this.filteredItems && this.filteredItems.length === 0 && this.openDropdown) {
      return;
    }

    if (ngSelectAutoComplete.element.childNodes[2].children[0].getElementsByClassName('ng-option-marked').length > 0) {
      ngSelectAutoComplete.element.childNodes[2].children[0].getElementsByClassName('ng-option-marked')[0].click();
    } else {
      ngSelectAutoComplete.element.childNodes[2].children[0].getElementsByClassName('ng-option')[0].click();
    }
    this.searchFocused = false;
  }

  closeDropDownSearchList() {
    this.closeDropDown();
  }

  onClose() {
    this.closeDropDown();
  }

  closeDropDown() {
    this.onMobileSearch.emit({isSearchOpen: false});
    this.openDropdown = false;
    // this.isAfterSelectBranch = true;
  }

  onChange($event) {
    currentSearchItems = [];
    currentSearchItemsCities = [];
    this.closeDropDown();
    this.searchButtonElem.nativeElement.focus();
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
    term = term.toLowerCase();
    if (term.length < 3) {
      return false;
    }
    if (item.type === 'city') {
      if (currentSearchItemsCities.length < 3 && item.name.toLowerCase().indexOf(term) > -1) {
        currentSearchItemsCities.push(item);
        return true;
      }
      return false;

    } else {
      const address = item.geographicAddress[0];
      if (currentSearchItems.length < 4 &&
          (item.branchName.toLowerCase().indexOf(term) > -1
            || address.cityName.toLowerCase().indexOf(term) > -1
            || address.streetName.toLowerCase().indexOf(term) > -1
            || String(address.buildingNumber).indexOf(term) > -1
            || String(item.branchNumber).indexOf(term) > -1)) {
            currentSearchItems.push(item);
            return true;
      }

      return false;
    }
  }


}
