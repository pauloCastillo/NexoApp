/** Coordinates from the device GPS */
export interface LocationCoords {
  latitude: number;
  longitude: number;
}

/** The schedule (clock-in/out) times tracked per day */
export interface ScheduleTime {
  startJob: string | null;
  breakJob: string | null;
  returnToWork: string | null;
  exitJob: string | null;
}

/** Shape of the timesLocation slice in Redux */
export interface LocationState {
  location: LocationCoords | null;
  schedule: ScheduleTime;
  status: string;
  message: string;
}

/** Payload for the takeTime reducer */
export interface TakeTimePayload {
  label: string;
  time: string;
}

/** Data sent to the API for registering a time + location punch */
export interface TimeLocationData {
  employee: string;
  label: string;
  time: string;
  location: LocationCoords | null;
}
