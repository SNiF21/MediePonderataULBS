import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  DEFAULT_DEPARTMENT,
  DEFAULT_FACULTY,
  FACULTIES,
  STUDY_DEGREES,
  STUDY_MAJORS,
  STUDY_SEMESTERS,
  STUDY_YEARS,
  SemesterRoman,
  StudyDegree,
  StudyMajor,
  Subject,
  YearOption,
  YearRoman,
  buildCurriculumKey,
  getDepartmentsForFaculty,
  getFacultyIcon,
  getMajorDegree,
  getMajorsForDepartment,
  getYearsForMajor,
} from '../models/studyProfile';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { AuthService } from './auth.service';
import { StudentProfile } from '../models/user.model';

const STORAGE_KEYS = {
  FACULTY: 'study_context:faculty',
  DEPARTMENT: 'study_context:department',
  DEGREE: 'study_context:degree',
  MAJOR: 'study_context:major',
  YEAR: 'study_context:year',
  SEMESTER: 'study_context:semester',
};

@Injectable({
  providedIn: 'root',
})
export class StudyContextService {
  private readonly authService = inject(AuthService);

  public readonly faculties = FACULTIES;
  public readonly studyDegrees = STUDY_DEGREES;
  public readonly majors = STUDY_MAJORS;
  public readonly allYears = STUDY_YEARS;
  public readonly semesters = STUDY_SEMESTERS;

  public readonly faculty = signal<string>(DEFAULT_FACULTY);
  public readonly facultyIcon = computed(() => getFacultyIcon(this.faculty()));
  public readonly department = signal<string>(DEFAULT_DEPARTMENT);
  public readonly degree = signal<StudyDegree>('Licență');
  public readonly major = signal<StudyMajor>('Calculatoare');
  public readonly year = signal<YearRoman>('I');
  public readonly semester = signal<SemesterRoman>('Semestrul I');

  public getAvailableYears(major: string, faculty?: string): YearOption[] {
    let maxCurriculumYear = 0;
    for (const y of STUDY_YEARS) {
      const s1Key = `${major} - ${y.key}, Semestrul 1`;
      const s2Key = `${major} - ${y.key}, Semestrul 2`;
      if (CURRICULUM_DATA[s1Key] || CURRICULUM_DATA[s2Key]) {
        const num = parseInt(y.key.replace(/\D/g, ''), 10);
        if (num > maxCurriculumYear) maxCurriculumYear = num;
      }
    }
    if (maxCurriculumYear > 0) {
      return STUDY_YEARS.slice(0, maxCurriculumYear);
    }
    return getYearsForMajor(major, faculty ?? this.faculty());
  }

  public readonly years = computed<YearOption[]>(() =>
    this.getAvailableYears(this.major(), this.faculty())
  );

  public readonly availableDepartments = computed(() =>
    getDepartmentsForFaculty(this.faculty())
  );

  public readonly availableMajors = computed(() =>
    getMajorsForDepartment(this.faculty(), this.department(), this.degree())
  );

  public readonly curriculumKey = computed(() =>
    buildCurriculumKey(this.major(), this.year(), this.semester())
  );

  public readonly subjects = computed<Subject[]>(
    () => CURRICULUM_DATA[this.curriculumKey()] ?? []
  );

  public readonly yearLabel = computed(
    () => this.years().find((y) => y.roman === this.year())?.label ?? 'Anul I'
  );

  public readonly semesterShortLabel = computed(
    () =>
      this.semesters.find((s) => s.roman === this.semester())?.shortLabel ??
      'Sem. I'
  );

  constructor() {
    this.initFromLocalStorage();
    this.syncWithAuthProfile();
  }

  private initFromLocalStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const savedFaculty = localStorage.getItem(STORAGE_KEYS.FACULTY);
      if (savedFaculty) {
        this.faculty.set(savedFaculty);
      }

      const savedDept = localStorage.getItem(STORAGE_KEYS.DEPARTMENT);
      if (savedDept) {
        this.department.set(savedDept);
      }

      const savedMajor = localStorage.getItem(STORAGE_KEYS.MAJOR) as StudyMajor | null;
      if (savedMajor && this.majors.includes(savedMajor)) {
        this.major.set(savedMajor);
      }

      const savedDegree = localStorage.getItem(STORAGE_KEYS.DEGREE) as StudyDegree | null;
      if (savedDegree && this.studyDegrees.includes(savedDegree)) {
        this.degree.set(savedDegree);
      } else if (savedMajor) {
        this.degree.set(getMajorDegree(savedMajor));
      }

      const validYears = this.getAvailableYears(this.major(), this.faculty());
      const savedYear = localStorage.getItem(STORAGE_KEYS.YEAR) as YearRoman | null;
      if (savedYear && validYears.some((y) => y.roman === savedYear)) {
        this.year.set(savedYear);
      } else {
        this.year.set('I');
      }

      const savedSemester = localStorage.getItem(STORAGE_KEYS.SEMESTER) as SemesterRoman | null;
      if (savedSemester && this.semesters.some((s) => s.roman === savedSemester)) {
        this.semester.set(savedSemester);
      }
    } catch {
      // ignore storage access errors
    }
  }

  private syncWithAuthProfile(): void {
    // Whenever logged in user's profile changes, update active context
    effect(
      () => {
        const profile = this.authService.profile();
        if (profile) {
          if (profile.faculty) {
            this.faculty.set(profile.faculty);
          }
          if (profile.department) {
            this.department.set(profile.department);
          }
          if (profile.degree && this.studyDegrees.includes(profile.degree)) {
            this.degree.set(profile.degree);
          } else if (profile.major) {
            this.degree.set(getMajorDegree(profile.major));
          }
          if (profile.major && this.majors.includes(profile.major)) {
            this.major.set(profile.major);
          }
          const validYears = this.getAvailableYears(this.major(), this.faculty());
          if (profile.year && validYears.some((y) => y.roman === profile.year)) {
            this.year.set(profile.year);
          } else if (!validYears.some((y) => y.roman === this.year())) {
            this.year.set('I');
          }
          if (profile.semester && this.semesters.some((s) => s.roman === profile.semester)) {
            this.semester.set(profile.semester);
          }
        }
      }
    );
  }

  public setDegree(deg: StudyDegree): void {
    this.degree.set(deg);
    this.saveToStorage(STORAGE_KEYS.DEGREE, deg);
    const majors = getMajorsForDepartment(this.faculty(), this.department(), deg);
    if (majors.length > 0 && (!majors.includes(this.major()) || getMajorDegree(this.major()) !== deg)) {
      this.setMajor(majors[0]);
    }
    this.syncToFirestore({ degree: deg, major: this.major(), year: this.year() });
  }

  public setFaculty(f: string): void {
    this.faculty.set(f);
    this.saveToStorage(STORAGE_KEYS.FACULTY, f);
    const depts = getDepartmentsForFaculty(f);
    if (depts.length > 0 && !depts.some((d) => d.name === this.department() || d.shortName === this.department())) {
      const newDept = depts[0].shortName;
      this.department.set(newDept);
      this.saveToStorage(STORAGE_KEYS.DEPARTMENT, newDept);
      const majors = getMajorsForDepartment(f, newDept, this.degree());
      if (majors.length > 0 && !majors.includes(this.major())) {
        this.setMajor(majors[0]);
      }
    }
    this.syncToFirestore({ faculty: f, department: this.department(), degree: this.degree(), major: this.major() });
  }

  public setDepartment(d: string): void {
    this.department.set(d);
    this.saveToStorage(STORAGE_KEYS.DEPARTMENT, d);
    const majors = getMajorsForDepartment(this.faculty(), d, this.degree());
    if (majors.length > 0 && !majors.includes(this.major())) {
      this.setMajor(majors[0]);
    }
    this.syncToFirestore({ department: d, degree: this.degree(), major: this.major() });
  }

  public setSemester(sem: SemesterRoman): void {
    this.semester.set(sem);
    this.saveToStorage(STORAGE_KEYS.SEMESTER, sem);
    this.syncToFirestore({ semester: sem });
  }

  public setYear(y: YearRoman): void {
    const validYears = this.years();
    if (!validYears.some((item) => item.roman === y)) {
      return;
    }
    this.year.set(y);
    this.saveToStorage(STORAGE_KEYS.YEAR, y);
    this.syncToFirestore({ year: y });
  }

  public setMajor(m: StudyMajor): void {
    this.major.set(m);
    this.saveToStorage(STORAGE_KEYS.MAJOR, m);

    // Sync degree if necessary
    const expectedDegree = getMajorDegree(m);
    if (this.degree() !== expectedDegree) {
      this.degree.set(expectedDegree);
      this.saveToStorage(STORAGE_KEYS.DEGREE, expectedDegree);
    }

    // Validate current year against the new major
    const validYears = this.getAvailableYears(m, this.faculty());
    if (!validYears.some((y) => y.roman === this.year())) {
      const fallbackYear = validYears[validYears.length - 1]?.roman ?? 'I';
      this.year.set(fallbackYear);
      this.saveToStorage(STORAGE_KEYS.YEAR, fallbackYear);
    }

    this.syncToFirestore({ degree: this.degree(), major: m, year: this.year() });
  }

  public setProfile(
    major: StudyMajor,
    year: YearRoman,
    semester: SemesterRoman,
    faculty?: string,
    department?: string,
    degree?: StudyDegree
  ): void {
    const fac = faculty ?? this.faculty();
    const dept = department ?? this.department();
    const deg = degree ?? getMajorDegree(major);

    const validYears = this.getAvailableYears(major, fac);
    const validYear = validYears.some((y) => y.roman === year)
      ? year
      : (validYears[validYears.length - 1]?.roman ?? 'I');

    this.faculty.set(fac);
    this.department.set(dept);
    this.degree.set(deg);
    this.major.set(major);
    this.year.set(validYear);
    this.semester.set(semester);

    this.saveToStorage(STORAGE_KEYS.FACULTY, fac);
    this.saveToStorage(STORAGE_KEYS.DEPARTMENT, dept);
    this.saveToStorage(STORAGE_KEYS.DEGREE, deg);
    this.saveToStorage(STORAGE_KEYS.MAJOR, major);
    this.saveToStorage(STORAGE_KEYS.YEAR, validYear);
    this.saveToStorage(STORAGE_KEYS.SEMESTER, semester);

    this.syncToFirestore({
      faculty: fac,
      department: dept,
      degree: deg,
      major,
      year: validYear,
      semester,
    });
  }

  private saveToStorage(key: string, value: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore storage errors
    }
  }

  private async syncToFirestore(updates: Partial<StudentProfile>): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    try {
      await this.authService.saveUserProfile({
        uid: user.uid,
        ...updates,
      });
    } catch (err) {
      console.warn('[StudyContextService] Failed to sync study context to Firestore:', err);
    }
  }
}
