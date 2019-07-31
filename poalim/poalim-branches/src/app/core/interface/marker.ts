import {GeoLocationObject} from './coordinates';
import {BranchSummarize} from '../models/branch-summarize-model';
import {BranchHours} from './branch-hours';

export interface Marker {
  coords: GeoLocationObject;
  address: string;
  branchName: string;
  branchNum: number;
  distanceInKm: number;
  infoWindow: BranchSummarize;
  label: number;
  iconUrl: object;
  isBamkat: boolean;
  openAndCloseHours: BranchHours;
}
