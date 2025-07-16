export function formatToDollar(price: number): string {
  return price.toLocaleString("en-CA");
}

export function formatToTimeAgo(date: string): string {
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diffInMs = time - now;

  const diffInMinutes = Math.round(diffInMs / (1000 * 60));
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat("en-CA");
  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, "minutes");
  } else if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, "hours");
  } else {
    return formatter.format(diffInDays, "days");
  }
}
