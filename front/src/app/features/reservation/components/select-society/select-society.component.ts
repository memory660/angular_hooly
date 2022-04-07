import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-select-society',
  templateUrl: './select-society.component.html',
  styleUrls: ['./select-society.component.scss']
})
export class SelectSocietyComponent implements OnInit {
  public societyForm!: FormGroup;
  societies$!: Observable<any>;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {
    this.societyForm = this.formBuilder.group({
      societyId: ['', Validators.required],
    });
    this.societies$ = httpService.getSocieties();
  }

  ngOnInit(): void {
  }

  public createFormGroup(): FormGroup {
    return this.societyForm;
  }
}
