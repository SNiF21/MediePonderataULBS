import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator-results.html',
})
export class CalculatorResultsComponent {
  public readonly weightedAverage = input<number | null>(null);
  public readonly isScholarshipEligible = input<boolean>(false);
  public readonly allSubjectsPassed = input<boolean>(false);
  public readonly hasFailingGrade = input<boolean>(false);
  public readonly passedCredits = input<number>(0);
  public readonly totalCredits = input<number>(0);
  public readonly failedCredits = input<number>(0);
  public readonly semesterLabel = input<string>('1');
  public readonly facultyName = input<string>('');
  public readonly majorName = input<string>('');
  public readonly yearLabel = input<string>('');

  public readonly copySuccess = signal<boolean>(false);

  /**
   * Shares the calculated semester average via Web Share API (mobile native share sheet)
   * or copies a formatted summary to the clipboard (desktop fallback).
   */
  public async shareResult(): Promise<void> {
    const avg = this.weightedAverage();
    if (avg === null) return;

    const formattedAvg = avg.toFixed(2);
    let statusText = 'Toate materiile promovate';
    if (this.isScholarshipEligible()) {
      statusText = 'Eligibil pentru bursă';
    } else if (this.hasFailingGrade()) {
      statusText = `${this.failedCredits()} credite restante`;
    }

    const faculty = this.facultyName() ? `${this.facultyName()} — ` : '';
    const major = this.majorName() ? `${this.majorName()}, ` : '';
    const year = this.yearLabel() ? `${this.yearLabel()}, ` : '';
    const sem = `Semestrul ${this.semesterLabel()}`;

    const shareData = {
      title: 'Calculator Medie Ponderată ULBS',
      text: `Media mea ponderată la ${faculty}${major}${year}${sem} este ${formattedAvg}/10 (${statusText}). Calculează-ți și tu media pe:`,
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
        // clipboard access denied or not available
      }
    }
  }
}
