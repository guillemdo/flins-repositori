import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetaPeliculaComponent } from './targeta-pelicula.component';

describe('TargetaPeliculaComponent', () => {
  let component: TargetaPeliculaComponent;
  let fixture: ComponentFixture<TargetaPeliculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetaPeliculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetaPeliculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
