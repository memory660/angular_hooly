import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReservationDto } from '../models/reservation-dto';
import { ReservationSave } from '../models/reservation-save';
import { SocietyDto } from '../models/society-dto';
import { UserDto } from '../models/user-dto';
import { ReservationStoreService } from './reservation-store.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private reservationStoreService: ReservationStoreService) { }

  saveReservations(reservation: ReservationSave): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body = JSON.stringify(reservation);
    return this.http.post(`${environment.url}/data/reservations`, body, {'headers':headers , observe: 'response'}).pipe(
      catchError(this.handleError)
    );
  }

  getLocations(): Observable<number[]> {
    return this.http.get<number[]>(`${environment.url}/data/locations`).pipe(
      catchError(this.handleError),
    );
  }

  setReservations(userID: number, societyId: number) {
    this.getReservations(userID, societyId).pipe(
      map((reservations: ReservationDto[]) => this.reservationStoreService.emitReservations(reservations)))
      .subscribe();
  }

  getReservations(userId: number, societyId: number): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(`${environment.url}/data/reservations/${userId}/${societyId}`).pipe(
      catchError(this.handleError)
    );
  }

  getReservationsFromSociety(societyId: number, date: string): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(`${environment.url}/data/reservations-society/${societyId}/${date}`).pipe(
      catchError(this.handleError)
    );
  }

  getSocieties(): Observable<SocietyDto[]> {

    return this.http.get<SocietyDto[]>(`${environment.url}/data/societies`).pipe(
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${environment.url}/data/users`).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error:any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
        return errorMessage;
    });
  }
}
