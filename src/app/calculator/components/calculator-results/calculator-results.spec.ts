import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorResultsComponent } from './calculator-results';

describe('CalculatorResultsComponent', () => {
  let component: CalculatorResultsComponent;
  let fixture: ComponentFixture<CalculatorResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorResultsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create calculator results component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive inputs with default values', () => {
    expect(component.weightedAverage()).toBeNull();
    expect(component.isScholarshipEligible()).toBe(false);
    expect(component.allSubjectsPassed()).toBe(false);
    expect(component.passedCredits()).toBe(0);
    expect(component.totalCredits()).toBe(0);
    expect(component.failedCredits()).toBe(0);
  });

  it('should do nothing on shareResult if weightedAverage is null', async () => {
    const shareSpy = vi.fn();
    Object.assign(navigator, { share: shareSpy });

    await component.shareResult();
    expect(shareSpy).not.toHaveBeenCalled();
  });

  it('should trigger navigator.share when available and average is present', async () => {
    fixture.componentRef.setInput('weightedAverage', 9.25);
    fixture.componentRef.setInput('isScholarshipEligible', true);
    fixture.componentRef.setInput('facultyName', 'Inginerie');
    fixture.componentRef.setInput('majorName', 'Calculatoare');
    fixture.detectChanges();

    const shareSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: shareSpy,
      configurable: true,
    });

    await component.shareResult();
    expect(shareSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Calculator Medie Ponderată ULBS'),
        url: 'https://simulator-medie-ponderata.web.app',
      })
    );
  });

  it('should fallback to clipboard if navigator.share is unavailable', async () => {
    fixture.componentRef.setInput('weightedAverage', 8.5);
    fixture.componentRef.setInput('facultyName', 'Inginerie');
    fixture.detectChanges();

    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
    });

    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextSpy },
      configurable: true,
    });

    await component.shareResult();
    expect(writeTextSpy).toHaveBeenCalled();
    expect(component.copySuccess()).toBe(true);
  });
});
