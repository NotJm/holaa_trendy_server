export const formattedDateInMinutes = (date: Date): string => {
  const now = new Date();

  const diff = date.getTime() - now.getTime();

  const minutes = Math.round(diff / (1000 * 60));

  return minutes.toString();
}