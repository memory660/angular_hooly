import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { reservations, societyFormDto1 } from 'src/app/spec-helpers/spec-helpers';
import { CombineDate } from '../../models/combine';
import { SocietyFormDto } from '../../models/formDto';
import { ReservationStoreService } from '../../services/reservation-store.service';

import { SelectDateComponent } from './select-date.component';

describe('SelectDateComponent', () => {
  let component: SelectDateComponent;
  let fixture: ComponentFixture<SelectDateComponent>;
  let fakeReservationStoreService: jasmine.SpyObj<ReservationStoreService>;

  beforeEach(async () => {

    fakeReservationStoreService = jasmine.createSpyObj<ReservationStoreService>('ReservationStoreService', ['getReservationsObs',]);
    fakeReservationStoreService.getReservationsObs.and.returnValue(of(reservations));


    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,],
      declarations: [ SelectDateComponent ],
      providers: [
        { provide: ReservationStoreService, useValue: fakeReservationStoreService },

      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDateComponent);
    component = fixture.componentInstance;
    component.societyObs$ = of(societyFormDto1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize', () => {
    const result = {reservations: reservations, society: societyFormDto1} as CombineDate;
    component.mix$.subscribe((data: CombineDate) => {
      expect(result).toEqual(data);
    })
  });
});
