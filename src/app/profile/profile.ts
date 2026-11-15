import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StudyContextService } from '../services/study-context.service';
import {
  STUDY_DEGREES,
  SemesterRoman,
  StudyDegree,
  StudyMajor,
  YearRoman,
  getDepartmentsForFaculty,
  getFacultyIcon,
  getMajorDegree,
  getMajorsForDepartment,
} from '../models/studyProfile';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal';
import { DeleteAccountModalComponent } from './components/delete-account-modal/delete-account-modal';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ChangePasswordModalComponent,
    DeleteAccountModalComponent,
  ],
  templateUrl: './profile.html',
})
export class ProfileComponent {
  protected readonly authService = inject(AuthService);
  protected readonly studyContext = inject(StudyContextService);
  private readonly router = inject(Router);

  public readonly isProfileConfigured = computed<boolean>(() => {
    if (!this.authService.isLoggedIn()) {
      return true;
    }
    const prof = this.authService.profile();
    return Boolean(prof?.faculty && prof?.major);
  });

  // Password change modal state
  protected readonly showPasswordModal = signal<boolean>(false);

  // Delete account modal state
  protected readonly showDeleteModal = signal<boolean>(false);

  // Success banners
  protected readonly profileUpdateSuccess = signal<boolean>(false);

  // Student email & profile computed
  protected readonly user = this.authService.user;
  protected readonly studentEmail = computed(() => this.user()?.email ?? '');

  public readonly studentGreeting = computed<string>(() => {
    const email = this.studentEmail().trim();
    if (!email) return 'Profil Student';
    const username = email.split('@')[0];
    const parts = username.split('.').filter(Boolean);
    if (parts.length >= 2) {
      const lastName = this.formatName(parts[parts.length - 1]);
      return `Salut, ${lastName}`;
    }
    if (parts.length === 1 && parts[0]) {
      const name = this.formatName(parts[0]);
      return `Salut, ${name}`;
    }
    return 'Profil Student';
  });

  private formatName(raw: string): string {
    if (!raw) return '';
    return raw
      .split('-')
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase())
      .join('-');
  }

  // Email verification state
  protected readonly isSendingVerification = signal<boolean>(false);
  protected readonly verificationSuccess = signal<string | null>(null);
  protected readonly verificationError = signal<string | null>(null);

  // Study context selection signals (pending save)
  public readonly studyDegrees = STUDY_DEGREES;
  protected readonly selectedFaculty = signal<string>(
    this.authService.isLoggedIn() && !this.authService.profile()?.faculty
      ? ''
      : (this.authService.profile()?.faculty || this.studyContext.faculty())
  );
  protected readonly selectedDepartment = signal<string>(
    this.authService.isLoggedIn() && !this.authService.profile()?.faculty
      ? ''
      : (this.authService.profile()?.department || this.studyContext.department())
  );
  protected readonly selectedDegree = signal<StudyDegree>(
    this.authService.profile()?.degree ?? this.studyContext.degree()
  );
  protected readonly selectedMajor = signal<StudyMajor | ''>(
    this.authService.isLoggedIn() && !this.authService.profile()?.major
      ? ''
      : (this.authService.profile()?.major || this.studyContext.major())
  );
  protected readonly selectedYear = signal<YearRoman>(
    this.authService.profile()?.year ?? this.studyContext.year()
  );
  protected readonly selectedSemester = signal<SemesterRoman>(
    this.authService.profile()?.semester ?? this.studyContext.semester()
  );
  protected readonly isSavingProfile = signal<boolean>(false);

  constructor() {
    effect(() => {
      const prof = this.authService.profile();
      const isLoggedIn = this.authService.isLoggedIn();

      if (isLoggedIn && prof) {
        if (!prof.faculty || !prof.major) {
          // Unconfigured profile: fields stay empty unless user made unsaved changes
          if (!this.hasProfileChanges()) {
            this.selectedFaculty.set('');
            this.selectedDepartment.set('');
            this.selectedDegree.set(prof.degree ?? 'Licență');
            this.selectedMajor.set('');
            this.selectedYear.set(prof.year ?? 'I');
            this.selectedSemester.set(prof.semester ?? 'Semestrul I');
          }
        } else {
          // Configured profile: populate with user's saved data
          if (!this.hasProfileChanges()) {
            this.selectedFaculty.set(prof.faculty);
            this.selectedDepartment.set(prof.department ?? '');
            this.selectedDegree.set(prof.degree ?? 'Licență');
            this.selectedMajor.set(prof.major);
            this.selectedYear.set(prof.year ?? 'I');
            this.selectedSemester.set(prof.semester ?? 'Semestrul I');
          }
        }
      } else if (!isLoggedIn) {
        // Guest mode: fallback to active studyContext defaults
        if (!this.hasProfileChanges()) {
          this.selectedFaculty.set(this.studyContext.faculty());
          this.selectedDepartment.set(this.studyContext.department());
          this.selectedDegree.set(this.studyContext.degree());
          this.selectedMajor.set(this.studyContext.major());
          this.selectedYear.set(this.studyContext.year());
          this.selectedSemester.set(this.studyContext.semester());
        }
      }
    });
  }

  protected async sendVerificationEmail(): Promise<void> {
    this.isSendingVerification.set(true);
    this.verificationSuccess.set(null);
    this.verificationError.set(null);
    try {
      await this.authService.sendVerificationEmail();
      this.verificationSuccess.set(
        'Un nou link de confirmare a fost trimis către ' + this.studentEmail() + '. Verifică inbox-ul (și dosarul Spam).'
      );
    } catch (err: unknown) {
      this.verificationError.set(this.authService.formatErrorMessage(err));
    } finally {
      this.isSendingVerification.set(false);
    }
  }

  protected async checkEmailVerification(): Promise<void> {
    this.verificationSuccess.set(null);
    this.verificationError.set(null);
    try {
      await this.authService.reloadUser();
      if (this.authService.isEmailVerified()) {
        this.verificationSuccess.set('Adresa ta instituțională a fost confirmată cu succes!');
      } else {
        this.verificationError.set('Adresa nu a fost încă validată. Verifică căsuța poștală sau apasă „Retrimite email”.');
      }
    } catch (err: unknown) {
      this.verificationError.set(this.authService.formatErrorMessage(err));
    }
  }

  protected readonly availableDepartments = computed(() => {
    const fac = this.selectedFaculty();
    return fac ? getDepartmentsForFaculty(fac) : [];
  });

  protected readonly availableMajors = computed(() => {
    const fac = this.selectedFaculty();
    const dept = this.selectedDepartment();
    const deg = this.selectedDegree();
    if (!fac || !dept) return [];
    return getMajorsForDepartment(fac, dept, deg);
  });

  public readonly availableYears = computed(() => {
    const m = this.selectedMajor();
    const f = this.selectedFaculty();
    if (!m) return this.studyContext.allYears;
    return this.studyContext.getAvailableYears(m, f || undefined);
  });

  protected readonly selectedFacultyIcon = computed(() => {
    const fac = this.selectedFaculty();
    return fac ? getFacultyIcon(fac) : 'assets/facultati/inginerie.png';
  });

  protected readonly hasProfileChanges = computed(() => {
    if (!this.isProfileConfigured()) {
      return Boolean(this.selectedFaculty() || this.selectedMajor());
    }
    return (
      this.selectedFaculty() !== this.studyContext.faculty() ||
      this.selectedDepartment() !== this.studyContext.department() ||
      this.selectedDegree() !== this.studyContext.degree() ||
      this.selectedMajor() !== this.studyContext.major() ||
      this.selectedYear() !== this.studyContext.year() ||
      this.selectedSemester() !== this.studyContext.semester()
    );
  });

  protected readonly canSave = computed(() => {
    if (!this.selectedFaculty() || !this.selectedMajor()) {
      return false;
    }
    return this.hasProfileChanges();
  });

  protected onFacultySelect(facultyName: string): void {
    this.selectedFaculty.set(facultyName);
    const depts = getDepartmentsForFaculty(facultyName);
    if (!this.isProfileConfigured()) {
      this.selectedDepartment.set('');
      this.selectedMajor.set('');
      return;
    }
    if (depts.length > 0) {
      const firstDept = depts[0].shortName;
      this.selectedDepartment.set(firstDept);
      const majors = getMajorsForDepartment(facultyName, firstDept, this.selectedDegree());
      if (majors.length > 0) {
        this.onMajorSelect(majors[0]);
      } else {
        this.selectedMajor.set('');
      }
    } else {
      this.selectedDepartment.set('');
      this.selectedMajor.set('');
    }
  }

  protected onDepartmentSelect(departmentShortOrName: string): void {
    this.selectedDepartment.set(departmentShortOrName);
    if (!this.isProfileConfigured() && !this.selectedMajor()) {
      return;
    }
    const majors = getMajorsForDepartment(this.selectedFaculty(), departmentShortOrName, this.selectedDegree());
    if (majors.length > 0 && (!this.selectedMajor() || !majors.includes(this.selectedMajor() as StudyMajor))) {
      this.onMajorSelect(majors[0]);
    } else if (majors.length === 0) {
      this.selectedMajor.set('');
    }
  }

  protected onDegreeSelect(degree: StudyDegree): void {
    this.selectedDegree.set(degree);
    if (this.selectedFaculty() && this.selectedDepartment()) {
      const majors = getMajorsForDepartment(this.selectedFaculty(), this.selectedDepartment(), degree);
      if (majors.length > 0 && (!this.selectedMajor() || !majors.includes(this.selectedMajor() as StudyMajor) || getMajorDegree(this.selectedMajor() as StudyMajor) !== degree)) {
        this.onMajorSelect(majors[0]);
      }
    }
  }

  protected onMajorSelect(major: StudyMajor | ''): void {
    this.selectedMajor.set(major);
    if (major) {
      const expDegree = getMajorDegree(major);
      if (this.selectedDegree() !== expDegree) {
        this.selectedDegree.set(expDegree);
      }
      const valid = this.studyContext.getAvailableYears(major, this.selectedFaculty());
      if (!valid.some((y) => y.roman === this.selectedYear())) {
        this.selectedYear.set(valid[valid.length - 1]?.roman ?? 'I');
      }
    }
  }

  protected onYearSelect(year: YearRoman): void {
    const valid = this.availableYears();
    if (valid.some((y) => y.roman === year)) {
      this.selectedYear.set(year);
    }
  }

  protected onSemesterSelect(semester: SemesterRoman): void {
    this.selectedSemester.set(semester);
  }

  protected resetProfileSelection(): void {
    if (!this.isProfileConfigured()) {
      this.selectedFaculty.set('');
      this.selectedDepartment.set('');
      this.selectedDegree.set('Licență');
      this.selectedMajor.set('');
      this.selectedYear.set('I');
      this.selectedSemester.set('Semestrul I');
    } else {
      this.selectedFaculty.set(this.studyContext.faculty());
      this.selectedDepartment.set(this.studyContext.department());
      this.selectedDegree.set(this.studyContext.degree());
      this.selectedMajor.set(this.studyContext.major());
      this.selectedYear.set(this.studyContext.year());
      this.selectedSemester.set(this.studyContext.semester());
    }
  }

  protected async saveProfile(): Promise<void> {
    const major = this.selectedMajor();
    const fac = this.selectedFaculty();
    if (!fac || !major) return;

    this.isSavingProfile.set(true);
    try {
      this.studyContext.setProfile(
        major as StudyMajor,
        this.selectedYear(),
        this.selectedSemester(),
        fac,
        this.selectedDepartment(),
        this.selectedDegree()
      );
      const user = this.authService.user();
      if (user) {
        await this.authService.saveUserProfile({
          uid: user.uid,
          faculty: fac,
          department: this.selectedDepartment(),
          degree: this.selectedDegree(),
          major: major as StudyMajor,
          year: this.selectedYear(),
          semester: this.selectedSemester(),
        });
      }
      this.profileUpdateSuccess.set(true);
      setTimeout(() => this.profileUpdateSuccess.set(false), 3000);
    } finally {
      this.isSavingProfile.set(false);
    }
  }

  // --- Password Change Methods ---
  protected openPasswordModal(): void {
    this.showPasswordModal.set(true);
  }

  protected closePasswordModal(): void {
    this.showPasswordModal.set(false);
  }

  // --- Logout Method ---
  protected async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  // --- Delete Account Methods ---
  protected openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  protected closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  public getContactQueryParams(): Record<string, string> {
    const fac = this.selectedFaculty() || this.studyContext.faculty();
    const maj = this.selectedMajor() || this.studyContext.major();
    return {
      category: 'credite',
      faculty: fac,
      major: maj,
      year: this.studyContext.yearLabel(),
      subjectTitle: `Plan de învățământ: ${fac}`,
      message: `Salut! Doresc să contribui cu planul de învățământ pentru ${fac}. Specializarea mea este ...`,
    };
  }
}
