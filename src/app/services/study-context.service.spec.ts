import { TestBed } from '@angular/core/testing';
import { StudyContextService } from './study-context.service';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

describe('StudyContextService', () => {
  let service: StudyContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudyContextService, AuthService, FirebaseService],
    });
    service = TestBed.inject(StudyContextService);
  });

  it('should initialize with default major, year, and semester', () => {
    expect(service.majors).toContain('Calculatoare');
    expect(service.majors).toContain('Tehnologia Informației');
    expect(service.majors).toContain('Ingineria Sistemelor Multimedia');
    expect(service.years().length).toBe(4);
    expect(service.allYears.length).toBe(4);
    expect(service.semesters.length).toBe(2);
  });

  it('should switch semester globally and update curriculumKey', () => {
    service.setSemester('Semestrul II');
    expect(service.semester()).toBe('Semestrul II');
    expect(service.curriculumKey()).toContain('Semestrul 2');

    service.setSemester('Semestrul I');
    expect(service.semester()).toBe('Semestrul I');
    expect(service.curriculumKey()).toContain('Semestrul 1');
  });

  it('should switch major and year and update subjects', () => {
    service.setMajor('Tehnologia Informației');
    service.setYear('II');
    service.setSemester('Semestrul I');

    expect(service.curriculumKey()).toBe('Tehnologia Informației - Anul 2, Semestrul 1');
    expect(service.subjects().length).toBeGreaterThan(0);
  });

  it('should initialize with Facultatea de Inginerie and departamentul CIE', () => {
    expect(service.faculty()).toBe('Facultatea de Inginerie');
    expect(service.facultyIcon()).toContain('inginerie.png');
    expect(service.department()).toBe('CIE');
    expect(service.faculties.length).toBeGreaterThanOrEqual(1);
    expect(service.availableDepartments().length).toBeGreaterThanOrEqual(1);
    expect(service.availableDepartments()[0].shortName).toBe('CIE');
    expect(service.availableMajors()).toContain('Calculatoare');
  });

  it('should support updating faculty and department with setProfile', () => {
    service.setProfile(
      'Ingineria Sistemelor Multimedia',
      'III',
      'Semestrul II',
      'Facultatea de Inginerie',
      'CIE'
    );

    expect(service.faculty()).toBe('Facultatea de Inginerie');
    expect(service.department()).toBe('CIE');
    expect(service.major()).toBe('Ingineria Sistemelor Multimedia');
    expect(service.year()).toBe('III');
    expect(service.semester()).toBe('Semestrul II');
  });

  it('should load curriculum subjects for Management (Științe Economice)', () => {
    service.setProfile(
      'Management',
      'I',
      'Semestrul I',
      'Facultatea de Științe Economice',
      'DMMA'
    );

    expect(service.major()).toBe('Management');
    expect(service.subjects().length).toBe(8);
    const totalCredits = service.subjects().reduce((sum, s) => sum + s.credits, 0);
    expect(totalCredits).toBe(31);
  });

  it('should load curriculum subjects for Informatică and Matematică Informatică (Științe)', () => {
    service.setProfile(
      'Informatică',
      'I',
      'Semestrul I',
      'Facultatea de Științe',
      'DMI'
    );
    expect(service.major()).toBe('Informatică');
    expect(service.subjects().length).toBe(8);
    let totalCredits = service.subjects().reduce((sum, s) => sum + s.credits, 0);
    expect(totalCredits).toBe(30);

    service.setMajor('Matematică Informatică');
    expect(service.subjects().length).toBe(9);
    totalCredits = service.subjects().reduce((sum, s) => sum + s.credits, 0);
    expect(totalCredits).toBe(30);
  });

  it('should return 3 years for 3-year majors and 4 years for 4-year majors', () => {
    service.setMajor('Calculatoare');
    expect(service.years().length).toBe(4);
    expect(service.years().map((y) => y.roman)).toEqual(['I', 'II', 'III', 'IV']);

    service.setMajor('Tehnologia Informației');
    expect(service.years().length).toBe(4);

    service.setMajor('Informatică');
    expect(service.years().length).toBe(3);
    expect(service.years().map((y) => y.roman)).toEqual(['I', 'II', 'III']);

    service.setMajor('Management');
    expect(service.years().length).toBe(3);
    expect(service.years().map((y) => y.roman)).toEqual(['I', 'II', 'III']);

    service.setMajor('Matematică Informatică');
    expect(service.years().length).toBe(3);
  });

  it('should auto-clamp year from IV to III when switching to a 3-year major', () => {
    service.setMajor('Calculatoare');
    service.setYear('IV');
    expect(service.year()).toBe('IV');

    service.setMajor('Informatică');
    expect(service.major()).toBe('Informatică');
    expect(service.year()).toBe('III');

    // Attempting to manually set year IV on a 3-year major should be ignored
    service.setYear('IV');
    expect(service.year()).toBe('III');
  });

  it('should clamp year when setProfile is called with year IV on a 3-year major', () => {
    service.setProfile(
      'Management',
      'IV',
      'Semestrul I',
      'Facultatea de Științe Economice',
      'DMMA'
    );
    expect(service.major()).toBe('Management');
    expect(service.year()).toBe('III');
  });
});
