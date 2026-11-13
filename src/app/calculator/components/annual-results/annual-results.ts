import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterRoman } from '../../../models/studyProfile';

@Component({
  selector: 'app-annual-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annual-results.html',
})
export class AnnualResultsComponent {
  public readonly annualAverage = input<number | null>(null);
  public readonly semester1Average = input<number | null>(null);
  public readonly semester2Average = input<number | null>(null);
  public readonly annualPassedCredits = input<number>(0);
  public readonly annualTotalCredits = input<number>(60);
  public readonly annualFailedCredits = input<number>(0);
  public readonly hasAnnualFailingGrade = input<boolean>(false);
  public readonly yearLabel = input<string>('Anul I');
  public readonly hasBothSemesters = input<boolean>(false);
  public readonly activeSemester = input<SemesterRoman>('Semestrul I');
  public readonly facultyName = input<string>('');
  public readonly majorName = input<string>('');

  public readonly switchSemester = output<SemesterRoman>();
  public readonly copySuccess = signal<boolean>(false);

  /**
   * Only show pending notice when viewing the semester that already HAS grades,
   * prompting to switch to the other semester.
   * Once the student switches to the missing semester, hide the notice.
   */
  public readonly showPendingNotice = computed<boolean>(() => {
    if (this.hasBothSemesters()) {
      return false;
    }
    const current = this.activeSemester();
    if (current === 'Semestrul I') {
      return this.semester1Average() !== null && this.semester2Average() === null;
    } else {
      return this.semester2Average() !== null && this.semester1Average() === null;
    }
  });

  protected onSwitchSemester(sem: SemesterRoman): void {
    this.switchSemester.emit(sem);
  }

  /**
   * Shares the calculated annual average via Web Share API or clipboard fallback.
   */
  public async shareAnnualResult(): Promise<void> {
    const avg = this.annualAverage();
    if (avg === null) return;

    const formattedAvg = avg.toFixed(2);
    let statusText = 'Integralist';
    if (avg >= 8.00 && !this.hasAnnualFailingGrade()) {
      statusText = 'Eligibil pentru bursă / menținere buget';
    } else if (this.hasAnnualFailingGrade()) {
      statusText = `${this.annualFailedCredits()} credite restante`;
    }

    const faculty = this.facultyName() ? `${this.facultyName()} — ` : '';
    const major = this.majorName() ? `${this.majorName()}, ` : '';
    const s1 = this.semester1Average() !== null ? this.semester1Average()!.toFixed(2) : '—';
    const s2 = this.semester2Average() !== null ? this.semester2Average()!.toFixed(2) : '—';

    const shareData = {
      title: 'Media Anuală Ponderată ULBS',
      text: `Media mea anuală la ${faculty}${major}${this.yearLabel()} este ${formattedAvg}/10 (Sem. 1: ${s1}, Sem. 2: ${s2} — ${statusText}). Calculează-ți și tu media pe:`,
      url: 'https://simulator-medie-ponderata.web.app',
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        this.copySuccess.set(true);
        setTimeout(() => this.copySuccess.set(false), 2500);
      } catch {
        // clipboard error
      }
    }
  }
}
