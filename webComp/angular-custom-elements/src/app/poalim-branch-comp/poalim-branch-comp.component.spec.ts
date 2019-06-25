import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoalimBranchCompComponent } from './poalim-branch-comp.component';

describe('PoalimBranchCompComponent', () => {
  let component: PoalimBranchCompComponent;
  let fixture: ComponentFixture<PoalimBranchCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoalimBranchCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoalimBranchCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
