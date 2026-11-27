export const RESERVATION_LATE_GRACE_PERIOD_MS = 30 * 60 * 1000;

export function combineReservationDateTime(date: Date, time: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds(),
  );
}
