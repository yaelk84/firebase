import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';
import { PoalimBranchCompComponent } from './poalim-branch-comp/poalim-branch-comp.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    PoalimBranchCompComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  /*entryComponents: [ButtonComponent],CHANGE TO WEB Component*/
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const customElement = createCustomElement(ButtonComponent, {injector: this.injector});
    customElements.define('app-button', customElement);
  }
}

