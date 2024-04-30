import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopsisDetailsComponent } from './synopsis-details.component';

describe('SynopsisDetailsComponent', () => {
  let component: SynopsisDetailsComponent;
  let fixture: ComponentFixture<SynopsisDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SynopsisDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SynopsisDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
