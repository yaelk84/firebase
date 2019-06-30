import {Component, OnInit} from '@angular/core';
import {AppService} from "./core/services/app.service";
import {RcTranslateService} from "@realcommerce/rc-packages";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'poalim-branches';
  constructor(private translateService: RcTranslateService,private appService:AppService) {


  }
  public appLoaded = false;
  ngOnInit(): void {
        this.appService.initApp().subscribe(() => {
           this.appLoaded = true;
    });
  }


}
