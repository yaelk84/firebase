import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-poalim-branch-comp',
  template: `
    <p>
      poalim-branch-comp works!
    </p>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.Native
})
export class PoalimBranchCompComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.onCallData();
  }

  onCallData() {
      this.http.get('/branches11').subscribe(response =>{
     console.log(response) ;
   });
  }

}
