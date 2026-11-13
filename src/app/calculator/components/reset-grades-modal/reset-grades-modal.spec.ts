import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetGradesModalComponent } from './reset-grades-modal';

describe('ResetGradesModalComponent', () => {
  let component: ResetGradesModalComponent;
  let fixture: ComponentFixture<ResetGradesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetGradesModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetGradesModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create reset grades modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModal when cancel is clicked', () => {
    let closed = false;
    component.closeModal.subscribe(() => {
      closed = true;
    });

    component.cancel();
    expect(closed).toBe(true);
  });

  it('should emit confirmReset when confirm is clicked', () => {
    let confirmed = false;
    component.confirmReset.subscribe(() => {
      confirmed = true;
    });

    component.confirm();
    expect(confirmed).toBe(true);
  });
});
