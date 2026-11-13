import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-grades-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reset-grades-modal.html',
})
export class ResetGradesModalComponent {
  public readonly yearLabel = input<string>('Anul I');
  public readonly semesterLabel = input<string>('Semestrul I');
  public readonly isLoggedIn = input<boolean>(false);

  public readonly closeModal = output<void>();
  public readonly confirmReset = output<void>();

  public cancel(): void {
    this.closeModal.emit();
  }

  public confirm(): void {
    this.confirmReset.emit();
  }
}
