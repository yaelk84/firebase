import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchBoxComponent } from './branch-box.component';

describe('BranchBoxComponent', () => {
  let component: BranchBoxComponent;
  let fixture: ComponentFixture<BranchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
