import { DayDto } from "./day-dto";
import { LocationDto } from "./location-dto";
import { UserDto } from "./user-dto";

export interface ReservationSave {
  date: string;
  no: number;
  societyId: number;
  userId: number;
}
