import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthComponent } from './auth';
import { AuthService } from '../services/auth.service';
import { StudyContextService } from '../services/study-context.service';
import { FirebaseService } from '../services/firebase.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [provideRouter([]), AuthService, StudyContextService, FirebaseService],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create auth component', () => {
    expect(component).toBeTruthy();
  });

  it('should adapt availableYears and clamp selectedYear for 3-year majors', () => {
    expect(component.availableYears().length).toBe(4);

    component['selectedYear'].set('IV');
    expect(component['selectedYear']()).toBe('IV');

    component['onMajorChange']('Informatică');
    expect(component.availableYears().length).toBe(3);
    expect(component['selectedYear']()).toBe('III');

    component['onMajorChange']('Calculatoare');
    expect(component.availableYears().length).toBe(4);
  });
});
