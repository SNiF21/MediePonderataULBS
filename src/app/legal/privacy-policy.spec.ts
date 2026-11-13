import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy';

describe('PrivacyPolicyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the privacy policy component', () => {
    const fixture = TestBed.createComponent(PrivacyPolicyComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the GDPR header and disclaimer', async () => {
    const fixture = TestBed.createComponent(PrivacyPolicyComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Politică de Confidențialitate'
    );
    expect(compiled.textContent).toContain('Regulamentul (UE) 2016/679');
    expect(compiled.textContent).toContain('Declinare de Responsabilitate');
  });

  it('should render the right to erasure and deletion mention', async () => {
    const fixture = TestBed.createComponent(PrivacyPolicyComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Dreptul la ștergere');
    expect(compiled.textContent).toContain('Șterge contul');
  });
});
