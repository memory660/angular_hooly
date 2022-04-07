import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationStoreService } from '../../services/reservation-store.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ReservationDto } from '../../models/reservation-dto';
import { combineLatest, Observable, Subscription, tap } from 'rxjs';
import { SocietyDto } from '../../models/society-dto';

export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class SelectDateComponent implements OnInit, OnDestroy {
  _data: any;
  @Input() set data(values: any) {
    this._data = values;
    console.log(values);
    if (values) this.action(values);
  }
  get data() {
    return this._data;
  }
  minDate = new Date(new Date().setDate(new Date().getDate() + 1));
  maxDate = new Date(new Date().setDate(new Date().getDate() + 365));
  datesRejectedArr = <string[]>[];
  dateForm: FormGroup;


  constructor(private formBuilder: FormBuilder, private reservationStoreService: ReservationStoreService) {
    this.dateForm = this.formBuilder.group({
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  action(data: any) {
    const society = data[0];
    const reservations = data[1];

    this.datesRejectedArr = [];
    reservations.forEach((reservation: ReservationDto) => {
      if (reservation.society.id === society.societyId) {
        const dateStart = new Date(reservation.day.dateBegin.date);
        const dateEnd = new Date(reservation.day.dateEnd.date);
        this.datesRejectedArr.push(...this.getDatesInRange(dateStart, dateEnd));
      } else {
        const dates = [];
        dates.push(new Date(reservation.day.dateReservation.date).toISOString().slice(0, 10));
        this.datesRejectedArr.push(...dates);
      }
    });
  }

  createFormGroup(): FormGroup {
    return this.dateForm;
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).toISOString().slice(0, 10);
    return !this.datesRejectedArr.some(v => day === v);
  };

  getDatesInRange(startDate: Date, endDate: Date) {
    const date = new Date(startDate.getTime());
    const dates = [];

    while (date <= endDate) {
      let d = new Date(date).toISOString().slice(0, 10);
      dates.push(d);
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }

  ngOnDestroy(): void {

  }
}
