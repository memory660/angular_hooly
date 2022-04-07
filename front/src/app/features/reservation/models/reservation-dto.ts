import { DayDto } from "./day-dto";
import { LocationDto } from "./location-dto";
import { SocietyDto } from "./society-dto";
import { UserDto } from "./user-dto";

export interface ReservationDto {
  id?: string;
  day: DayDto;
  location: LocationDto;
  society: SocietyDto;
  user: UserDto;
}
