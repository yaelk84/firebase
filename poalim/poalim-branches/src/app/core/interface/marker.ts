import {GeoLocationObject} from './coordinates';
import {BranchSummarize} from '../models/branch-summarize-model';

export interface Marker {
  coords: GeoLocationObject;
  infoWindow: BranchSummarize;
  label: number;
  iconUrl: object;
}
