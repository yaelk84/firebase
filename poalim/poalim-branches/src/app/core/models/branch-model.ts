export class BranchObj {
  id: number;
  branchNum: number;
  branchName: string;
  address: string;
  distance: number;
  openHours: string;
  closeHours: string;
  closeNow: boolean;
  change: boolean;


  constructor(id, branchNum, branchName, address, distance, openHours, closeHours, closeNow, change) {
    this.id = id;
    this.branchNum = branchNum;
    this.branchName = branchName;
    this.address = address;
    this.distance = distance;
    this.id = openHours;
    this.id = closeHours;
    this.closeNow = closeNow;
    this.change = change
  }
}
