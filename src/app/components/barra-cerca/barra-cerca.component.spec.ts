import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraCercaComponent } from './barra-cerca.component';

describe('BarraCercaComponent', () => {
  let component: BarraCercaComponent;
  let fixture: ComponentFixture<BarraCercaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraCercaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraCercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
