import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StudyContextService } from '../services/study-context.service';
import {
  SemesterRoman,
  StudyMajor,
  YearRoman,
  getDepartmentsForFaculty,
  getFacultyIcon,
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

  constructor() {
    effect(() => {
      const f = this.studyContext.faculty();
      const d = this.studyContext.department();
      const m = this.studyContext.major();
      const y = this.studyContext.year();
      const s = this.studyContext.semester();
      if (!this.hasProfileChanges()) {
        this.selectedFaculty.set(f);
        this.selectedDepartment.set(d);
        this.selectedMajor.set(m);
        this.selectedYear.set(y);
        this.selectedSemester.set(s);
      }
    });
  }

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

  // Study context selection signals (pending save)
  protected readonly selectedFaculty = signal<string>(this.studyContext.faculty());
  protected readonly selectedDepartment = signal<string>(this.studyContext.department());
  protected readonly selectedMajor = signal<StudyMajor>(this.studyContext.major());
  protected readonly selectedYear = signal<YearRoman>(this.studyContext.year());
  protected readonly selectedSemester = signal<SemesterRoman>(this.studyContext.semester());
  protected readonly isSavingProfile = signal<boolean>(false);

  protected readonly availableDepartments = computed(() =>
    getDepartmentsForFaculty(this.selectedFaculty())
  );
  protected readonly availableMajors = computed(() =>
    getMajorsForDepartment(this.selectedFaculty(), this.selectedDepartment())
  );
  public readonly availableYears = computed(() =>
    this.studyContext.getAvailableYears(this.selectedMajor(), this.selectedFaculty())
  );
  protected readonly selectedFacultyIcon = computed(() =>
    getFacultyIcon(this.selectedFaculty())
  );

  protected readonly hasProfileChanges = computed(() => {
    return (
      this.selectedFaculty() !== this.studyContext.faculty() ||
      this.selectedDepartment() !== this.studyContext.department() ||
      this.selectedMajor() !== this.studyContext.major() ||
      this.selectedYear() !== this.studyContext.year() ||
      this.selectedSemester() !== this.studyContext.semester()
    );
  });

  protected onFacultySelect(facultyName: string): void {
    this.selectedFaculty.set(facultyName);
    const depts = getDepartmentsForFaculty(facultyName);
    if (depts.length > 0 && !depts.some((d) => d.shortName === this.selectedDepartment() || d.name === this.selectedDepartment())) {
      const firstDept = depts[0].shortName;
      this.selectedDepartment.set(firstDept);
      const majors = getMajorsForDepartment(facultyName, firstDept);
      if (majors.length > 0) {
        this.onMajorSelect(majors[0]);
      }
    }
  }

  protected onDepartmentSelect(departmentShortOrName: string): void {
    this.selectedDepartment.set(departmentShortOrName);
    const majors = getMajorsForDepartment(this.selectedFaculty(), departmentShortOrName);
    if (majors.length > 0 && !majors.includes(this.selectedMajor())) {
      this.onMajorSelect(majors[0]);
    }
  }

  protected onMajorSelect(major: StudyMajor): void {
    this.selectedMajor.set(major);
    const valid = this.studyContext.getAvailableYears(major, this.selectedFaculty());
    if (!valid.some((y) => y.roman === this.selectedYear())) {
      this.selectedYear.set(valid[valid.length - 1]?.roman ?? 'I');
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
    this.selectedFaculty.set(this.studyContext.faculty());
    this.selectedDepartment.set(this.studyContext.department());
    this.selectedMajor.set(this.studyContext.major());
    this.selectedYear.set(this.studyContext.year());
    this.selectedSemester.set(this.studyContext.semester());
  }

  protected async saveProfile(): Promise<void> {
    this.isSavingProfile.set(true);
    try {
      this.studyContext.setProfile(
        this.selectedMajor(),
        this.selectedYear(),
        this.selectedSemester(),
        this.selectedFaculty(),
        this.selectedDepartment()
      );
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
    return {
      category: 'credite',
      faculty: this.selectedFaculty(),
      major: this.selectedMajor(),
      year: this.studyContext.yearLabel(),
      subjectTitle: `Plan de învățământ: ${this.selectedFaculty()}`,
      message: `Salut! Doresc să contribui cu planul de învățământ pentru ${this.selectedFaculty()}. Specializarea mea este ...`,
    };
  }
}
