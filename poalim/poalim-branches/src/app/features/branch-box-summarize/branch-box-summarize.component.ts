import {Component, Input, OnInit} from '@angular/core';
import {HoursService} from '../../core/services/hours.service';
import {MapBranchesService} from '../../core/services/map-branches.service';

@Component({
  selector: 'app-branch-box-summarize',
  templateUrl: './branch-box-summarize.component.html',
  styleUrls: ['./branch-box-summarize.component.scss']
})
export class BranchBoxSummarizeComponent implements OnInit {
  hoursList: any[] = [];
  openAndCloseHours;
  openHoursDrop = false;
  haveLocation;
  constructor(private hoursFunc: HoursService , private mapService: MapBranchesService) { }
  @Input() branchDataSummarize: any;
  @Input() isSingleDisplay: boolean;
  @Input()  filterByDay: boolean;

  closeDropDown() {
    this.openHoursDrop = false;
  }
  dropClick() {
    this.openHoursDrop = !this.openHoursDrop;
  }
  ngOnInit() {
   this.haveLocation = this.mapService.hasLocationPermission;
    this.openAndCloseHours = this.branchDataSummarize.openAndCloseHours;
    this.hoursList = this.hoursFunc.creatHoursWeekList(this.openAndCloseHours);
     }

}
