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

  it('should reject non-matching passwords on registration', async () => {
    component['setMode']('register');
    component['email'].set('andrei.popa@ulbsibiu.ro');
    component['password'].set('parola123');
    component['confirmPassword'].set('parolaDiferita');
    component.acceptedGdpr.set(true);

    await component['onSubmit']();

    expect(component['errorMessage']()).toContain('Parolele introduse nu coincid');
  });

  it('should reject invalid institutional domain on submit', async () => {
    component['setMode']('register');
    component['email'].set('student@gmail.com');
    component['password'].set('parola123');
    component['confirmPassword'].set('parola123');
    component.acceptedGdpr.set(true);

    await component['onSubmit']();

    expect(component['errorMessage']()).toContain('@ulbsibiu.ro');
  });

  it('should call authService.register on valid registration', async () => {
    const authService = TestBed.inject(AuthService);
    const registerSpy = vi.spyOn(authService, 'register').mockResolvedValue(undefined as any);

    component['setMode']('register');
    component['email'].set('student.nou@ulbsibiu.ro');
    component['password'].set('parola123');
    component['confirmPassword'].set('parola123');
    component.acceptedGdpr.set(true);

    await component['onSubmit']();

    expect(registerSpy).toHaveBeenCalledWith('student.nou@ulbsibiu.ro', 'parola123');
  });

  it('should block registration when GDPR is not accepted', async () => {
    component['setMode']('register');
    component['email'].set('andrei.popa@ulbsibiu.ro');
    component['password'].set('parola123');
    component['confirmPassword'].set('parola123');
    component.acceptedGdpr.set(false);

    await component['onSubmit']();

    expect(component['errorMessage']()).toContain('Politica de Confidențialitate & GDPR');
  });

  it('should reset acceptedGdpr when switching mode', () => {
    component.acceptedGdpr.set(true);
    component['setMode']('login');
    expect(component.acceptedGdpr()).toBe(false);
  });
});
