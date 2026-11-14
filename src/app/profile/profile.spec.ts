import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProfileComponent } from './profile';
import { AuthService } from '../services/auth.service';
import { StudyContextService } from '../services/study-context.service';
import { FirebaseService } from '../services/firebase.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideRouter([]), AuthService, StudyContextService, FirebaseService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create profile component', () => {
    expect(component).toBeTruthy();
  });

  it('should manage password modal open and close', () => {
    expect(component['showPasswordModal']()).toBe(false);
    component['openPasswordModal']();
    expect(component['showPasswordModal']()).toBe(true);
    component['closePasswordModal']();
    expect(component['showPasswordModal']()).toBe(false);
  });

  it('should manage delete account modal open and close', () => {
    expect(component['showDeleteModal']()).toBe(false);
    component['openDeleteModal']();
    expect(component['showDeleteModal']()).toBe(true);
    component['closeDeleteModal']();
    expect(component['showDeleteModal']()).toBe(false);
  });

  it('should initialize email verification state', () => {
    expect(component['isSendingVerification']()).toBe(false);
    expect(component['verificationSuccess']()).toBeNull();
    expect(component['verificationError']()).toBeNull();
  });

  it('should track profile changes and save them', async () => {
    expect(component['hasProfileChanges']()).toBe(false);
    component['onMajorSelect']('Tehnologia Informației');
    expect(component['hasProfileChanges']()).toBe(true);

    await component['saveProfile']();
    expect(component['hasProfileChanges']()).toBe(false);
  });

  it('should manage faculty and department selections in profile', () => {
    expect(component['selectedFaculty']()).toBe('Facultatea de Inginerie');
    expect(component['selectedDepartment']()).toBe('CIE');
    expect(component['availableDepartments']().length).toBeGreaterThan(0);

    component['onDepartmentSelect']('CIE');
    expect(component['selectedDepartment']()).toBe('CIE');
  });

  it('should adjust availableYears and clamp selectedYear when selecting a 3-year major', () => {
    expect(component['availableYears']().length).toBe(4);

    component['onYearSelect']('IV');
    expect(component['selectedYear']()).toBe('IV');

    component['onMajorSelect']('Informatică');
    expect(component['availableYears']().length).toBe(3);
    expect(component['selectedYear']()).toBe('III');

    // Attempting to select Year IV should be rejected
    component['onYearSelect']('IV');
    expect(component['selectedYear']()).toBe('III');
  });

  it('should compute personalized student greeting from institutional email', () => {
    const authService = TestBed.inject(AuthService);

    // Default with no user
    authService.user.set(null);
    expect(component.studentGreeting()).toBe('Profil Student');

    // Standard ULBS email with first names and last name (requested: dragosconstantin.braicu@ulbsibiu.ro -> Salut, Braicu)
    authService.user.set({ email: 'dragosconstantin.braicu@ulbsibiu.ro' } as any);
    expect(component.studentGreeting()).toBe('Salut, Braicu');

    // Multiple first names or dotted parts
    authService.user.set({ email: 'ion.vasile.ionescu@ulbsibiu.ro' } as any);
    expect(component.studentGreeting()).toBe('Salut, Ionescu');

    // Single name
    authService.user.set({ email: 'student@ulbsibiu.ro' } as any);
    expect(component.studentGreeting()).toBe('Salut, Student');

    // Hyphenated last name
    authService.user.set({ email: 'maria.ionescu-radulescu@ulbsibiu.ro' } as any);
    expect(component.studentGreeting()).toBe('Salut, Ionescu-Radulescu');
  });

  it('should manage degree picker (Licență vs Master) and filter availableMajors in ProfileComponent', async () => {
    // Initial state should be Licență
    expect(component['selectedDegree']()).toBe('Licență');
    const bachelors = component['availableMajors']();
    expect(bachelors.length).toBeGreaterThan(0);
    expect(bachelors).toContain('Calculatoare');
    expect(bachelors).not.toContain('Advanced Computing Systems');

    // Switch to Master
    component['onDegreeSelect']('Master');
    expect(component['selectedDegree']()).toBe('Master');
    const masters = component['availableMajors']();
    expect(masters.length).toBeGreaterThan(0);
    expect(masters).toContain('Advanced Computing Systems');
    expect(masters).toContain('Applied Artificial Intelligence');
    expect(masters).not.toContain('Calculatoare');

    // Saving profile should update StudyContextService
    await component['saveProfile']();
    const studyContext = TestBed.inject(StudyContextService);
    expect(studyContext.degree()).toBe('Master');

    // Switch back to Licență
    component['onDegreeSelect']('Licență');
    expect(component['selectedDegree']()).toBe('Licență');
    expect(component['availableMajors']()).toContain('Calculatoare');
  });
});
