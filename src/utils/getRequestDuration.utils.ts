export default function getRequestDuration(startTime: [number, number]) {
  const [second, nanoSecond] = process.hrtime(startTime);

  return (second * 1e9 + nanoSecond) / 1e9;
}
