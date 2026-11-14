import { TestBed } from '@angular/core/testing';
import { StudyContextService } from './study-context.service';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { StudyMajor, getMajorDegree, getMajorsForDepartment } from '../models/studyProfile';

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

  it('should load curriculum subjects for new Engineering majors (CIE, IIM, MEI)', () => {
    // CIE - Electronică Aplicată
    service.setProfile('Electronică Aplicată', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'CIE');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // CIE - Electromecanică
    service.setProfile('Electromecanică', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'CIE');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // MEI - Inginerie Economică Industrială
    service.setProfile('Inginerie Economică Industrială', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'MEI');
    expect(service.subjects().length).toBe(9);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // MEI - Mecatronică
    service.setProfile('Mecatronică', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'MEI');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // MEI - Mecatronică (în limba engleză)
    service.setProfile('Mecatronică (în limba engleză)', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'MEI');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // MEI - Robotică
    service.setProfile('Robotică', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'MEI');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // MEI - Robotică (Dual)
    service.setProfile('Robotică (Dual)', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'MEI');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // MEI - Sisteme de Producție Digitale
    service.setProfile('Sisteme de Producție Digitale', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'MEI');
    expect(service.subjects().length).toBe(9);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // IIM - Ingineria Transporturilor și a Traficului
    service.setProfile('Ingineria Transporturilor și a Traficului', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'IIM');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // IIM - Transportul, Depozitarea și Distribuția Hidrocarburilor
    service.setProfile('Transportul, Depozitarea și Distribuția Hidrocarburilor', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'IIM');
    expect(service.subjects().length).toBe(10);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // CIE - Electronică Aplicată (Dual)
    service.setProfile('Electronică Aplicată (Dual)', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'CIE');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // IIM - Inginerie Economică în Domeniul Mecanic (ID)
    service.setProfile('Inginerie Economică în Domeniul Mecanic (ID)', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'IIM');
    expect(service.subjects().length).toBe(9);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // IIM - Transportul, Depozitarea și Distribuția Hidrocarburilor (FR)
    service.setProfile('Transportul, Depozitarea și Distribuția Hidrocarburilor (FR)', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'IIM');
    expect(service.subjects().length).toBe(10);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // MEI - Mecatronică (Dual)
    service.setProfile('Mecatronică (Dual)', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'MEI');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // IIM - Inginerie Economică în Domeniul Mecanic
    service.setProfile('Inginerie Economică în Domeniul Mecanic', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'IIM');
    expect(service.subjects().length).toBe(9);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);

    // IIM - Tehnologia Construcțiilor de Mașini
    service.setProfile('Tehnologia Construcțiilor de Mașini', 'I', 'Semestrul I', 'Facultatea de Inginerie', 'IIM');
    expect(service.subjects().length).toBe(8);
    expect(service.subjects().reduce((sum, s) => sum + s.credits, 0)).toBe(30);
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

  it('should have exactly 30 credits for every semester in Mecatronică, Robotică, IEDM, TCM and their variants', () => {
    const years: ('I' | 'II' | 'III' | 'IV')[] = ['I', 'II', 'III', 'IV'];
    const semesters: ('Semestrul I' | 'Semestrul II')[] = ['Semestrul I', 'Semestrul II'];
    const meiMajors: StudyMajor[] = [
      'Mecatronică',
      'Mecatronică (în limba engleză)',
      'Mecatronică (Dual)',
      'Robotică',
      'Robotică (Dual)',
      'Sisteme de Producție Digitale',
    ];
    const iimMajors: StudyMajor[] = [
      'Inginerie Economică în Domeniul Mecanic',
      'Inginerie Economică în Domeniul Mecanic (ID)',
      'Tehnologia Construcțiilor de Mașini',
      'Transportul, Depozitarea și Distribuția Hidrocarburilor',
      'Transportul, Depozitarea și Distribuția Hidrocarburilor (FR)',
    ];
    const cieMajors: StudyMajor[] = [
      'Electronică Aplicată (Dual)',
    ];

    for (const major of meiMajors) {
      for (const y of years) {
        for (const s of semesters) {
          service.setProfile(major, y, s, 'Facultatea de Inginerie', 'MEI');
          const subs = service.subjects();
          expect(subs.length).toBeGreaterThan(0);
          const totalCredits = subs.reduce((sum, item) => sum + item.credits, 0);
          expect(totalCredits).toBe(30);
        }
      }
    }

    for (const major of iimMajors) {
      for (const y of years) {
        for (const s of semesters) {
          service.setProfile(major, y, s, 'Facultatea de Inginerie', 'IIM');
          const subs = service.subjects();
          expect(subs.length).toBeGreaterThan(0);
          const totalCredits = subs.reduce((sum, item) => sum + item.credits, 0);
          expect(totalCredits).toBe(30);
        }
      }
    }

    for (const major of cieMajors) {
      for (const y of years) {
        for (const s of semesters) {
          service.setProfile(major, y, s, 'Facultatea de Inginerie', 'CIE');
          const subs = service.subjects();
          expect(subs.length).toBeGreaterThan(0);
          const totalCredits = subs.reduce((sum, item) => sum + item.credits, 0);
          expect(totalCredits).toBe(30);
        }
      }
    }
  });

  it('should differentiate Licență (3-4 years) vs Master (1-2 years) correctly with getMajorDegree', () => {
    // Bachelor (3 or 4 years)
    expect(getMajorDegree('Calculatoare')).toBe('Licență');
    expect(getMajorDegree('Tehnologia Informației')).toBe('Licență');
    expect(getMajorDegree('Management')).toBe('Licență');
    expect(getMajorDegree('Informatică')).toBe('Licență');
    expect(getMajorDegree('Matematică Informatică')).toBe('Licență');

    // Master (1 or 2 years)
    const masterMajors: StudyMajor[] = [
      'Applied Artificial Intelligence',
      'Aplicații Avansate în Ingineria Electrică',
      'Advanced Computing Systems',
      'Embedded Systems',
      'Ingineria Calculatoarelor în Aplicații Industriale',
      'Ingineria și Managementul Gazelor Naturale',
      'Logistică Industrială',
      'Managementul Afacerilor Industriale',
      'Managementul Calității',
      'Managementul Proiectelor',
      'Sisteme și Tehnologii Inteligente de Fabricație',
      'Sisteme CAD-CAE-CAM în Deformarea Plastică',
      'Sisteme Mecatronice Avansate',
      'Sisteme Mecatronice Avansate (Dual)',
    ];

    for (const m of masterMajors) {
      expect(getMajorDegree(m)).toBe('Master');
    }
  });

  it('should filter majors by degree in getMajorsForDepartment', () => {
    const cieLicenta = getMajorsForDepartment('Facultatea de Inginerie', 'CIE', 'Licență');
    const cieMaster = getMajorsForDepartment('Facultatea de Inginerie', 'CIE', 'Master');
    expect(cieLicenta.length).toBe(6);
    expect(cieLicenta).toContain('Calculatoare');
    expect(cieLicenta).not.toContain('Advanced Computing Systems');

    expect(cieMaster.length).toBe(5);
    expect(cieMaster).toContain('Advanced Computing Systems');
    expect(cieMaster).toContain('Applied Artificial Intelligence');
    expect(cieMaster).not.toContain('Calculatoare');

    const iimLicenta = getMajorsForDepartment('Facultatea de Inginerie', 'IIM', 'Licență');
    const iimMaster = getMajorsForDepartment('Facultatea de Inginerie', 'IIM', 'Master');
    expect(iimLicenta.length).toBe(6);
    expect(iimMaster.length).toBe(6);
    expect(iimMaster).toContain('Managementul Proiectelor');
    expect(iimMaster).not.toContain('Tehnologia Construcțiilor de Mașini');

    const meiLicenta = getMajorsForDepartment('Facultatea de Inginerie', 'MEI', 'Licență');
    const meiMaster = getMajorsForDepartment('Facultatea de Inginerie', 'MEI', 'Master');
    expect(meiLicenta.length).toBe(7);
    expect(meiMaster.length).toBe(3);
    expect(meiMaster).toContain('Sisteme Mecatronice Avansate');
    expect(meiMaster).not.toContain('Mecatronică');
  });

  it('should manage degree state and filter availableMajors in StudyContextService', () => {
    expect(service.degree()).toBe('Licență');
    const bachelors = service.availableMajors();
    expect(bachelors.every((m) => getMajorDegree(m) === 'Licență')).toBe(true);

    service.setDegree('Master');
    expect(service.degree()).toBe('Master');
    const masters = service.availableMajors();
    expect(masters.length).toBeGreaterThan(0);
    expect(masters.every((m) => getMajorDegree(m) === 'Master')).toBe(true);
    expect(getMajorDegree(service.major())).toBe('Master');

    service.setDegree('Licență');
    expect(service.degree()).toBe('Licență');
    expect(service.availableMajors().every((m) => getMajorDegree(m) === 'Licență')).toBe(true);
  });

  it('should load curriculum subjects for all 14 new Master majors with 30 credits per semester', () => {
    const masterMajorsData: { major: StudyMajor; dept: string; years: ('I' | 'II')[]; semesters: ('Semestrul I' | 'Semestrul II')[] }[] = [
      { major: 'Applied Artificial Intelligence', dept: 'CIE', years: ['I'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Aplicații Avansate în Ingineria Electrică', dept: 'CIE', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Advanced Computing Systems', dept: 'CIE', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Embedded Systems', dept: 'CIE', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Ingineria Calculatoarelor în Aplicații Industriale', dept: 'CIE', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Ingineria și Managementul Gazelor Naturale', dept: 'IIM', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Logistică Industrială', dept: 'IIM', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Managementul Afacerilor Industriale', dept: 'IIM', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Managementul Calității', dept: 'IIM', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Managementul Proiectelor', dept: 'IIM', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Sisteme și Tehnologii Inteligente de Fabricație', dept: 'IIM', years: ['II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Sisteme CAD-CAE-CAM în Deformarea Plastică', dept: 'MEI', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Sisteme Mecatronice Avansate', dept: 'MEI', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
      { major: 'Sisteme Mecatronice Avansate (Dual)', dept: 'MEI', years: ['I', 'II'], semesters: ['Semestrul I', 'Semestrul II'] },
    ];

    for (const item of masterMajorsData) {
      for (const y of item.years) {
        for (const s of item.semesters) {
          service.setProfile(item.major, y, s, 'Facultatea de Inginerie', item.dept, 'Master');
          expect(service.degree()).toBe('Master');
          expect(service.major()).toBe(item.major);
          const subs = service.subjects();
          expect(subs.length).toBeGreaterThan(0);
          const totalCredits = subs.reduce((sum, sub) => sum + sub.credits, 0);
          expect(totalCredits).toBe(30);
        }
      }
    }
  });
});
