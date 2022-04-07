import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { SocietyDto } from '../../models/society-dto';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {
  @Input() dateObs!: Observable<any>;
  @Input() societyObs!: Observable<SocietyDto>;
  locationForm: FormGroup;
  locations$: Observable<number[]>;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {
    this.locationForm = this.formBuilder.group({
      no: [{value: '', disabled: false}, Validators.required, ],
    });
    this.locations$ = httpService.getLocations();
  }

  ngOnInit(): void {
    let that = this;

    this.locations$ = combineLatest({
      society: this.societyObs,
      date: this.dateObs,
      locations: this.locations$
    }).pipe(
      filter((data: any) => data.date.date != null && data.society != null),
      switchMap(
        (data: any) => that.httpService.getReservationsFromSociety(data.society.societyId as number, data.date.date)
        .pipe(
            map((nos: any) => that.getArraysIntersection(data.locations, nos.map((v: any) => v.locationNo))),
        )
      )
    );
  }

  getArraysIntersection(a1: Array<number>, a2: Array<number>){
    // intersection entre tous les emplacements et les emplacements qui ont été reservés
    return a1.filter(function(n) { return a2.indexOf(n) == -1;});
  }

  createFormGroup(): FormGroup {
    return this.locationForm;
  }
}
