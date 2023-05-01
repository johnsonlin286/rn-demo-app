export default function is24Hours(time: string) {
  const savedTime = new Date(time);
  const current = new Date();
  const time_difference = current.getTime() - savedTime.getTime();
  const hours_difference = time_difference / (1000 * 60 * 60);

  if (hours_difference >= 24) {
    return true;
  } else return false;
}
