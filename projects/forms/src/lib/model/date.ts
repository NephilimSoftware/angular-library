export function toDateTimeLocal(date: Date | null): string {
  if (date === null || isNaN(+date)) {
    return '';
  }

  const year: string = `${date.getFullYear()}`;
  const month: string = toTwoDigitNumber(date.getMonth() + 1);
  const day: string = toTwoDigitNumber(date.getDate());
  const hours: string = toTwoDigitNumber(date.getHours());
  const minutes: string = toTwoDigitNumber(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toTwoDigitNumber(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}
