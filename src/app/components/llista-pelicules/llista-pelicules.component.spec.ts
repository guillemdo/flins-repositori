import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlistaPeliculesComponent } from './llista-pelicules.component';

describe('LlistaPeliculesComponent', () => {
  let component: LlistaPeliculesComponent;
  let fixture: ComponentFixture<LlistaPeliculesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlistaPeliculesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlistaPeliculesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
