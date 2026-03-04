export default function CalculateIteration() {
  // Baseline: Iteration 49 starts Feb 16, 2026 (Philippine Time)
  const baseIterationNumber = 49;
  const baseStartDate = new Date("2026-02-16T00:00:00+08:00"); // PH time

  const today = new Date();

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.floor((today - baseStartDate) / msPerDay);

  const sprintLength = 14; // 2 weeks
  const sprintOffset = Math.floor(diffInDays / sprintLength);

  const currentNumber = baseIterationNumber + sprintOffset;

  const currentStart = new Date(baseStartDate);
  currentStart.setDate(baseStartDate.getDate() + sprintOffset * sprintLength);

  const currentEnd = new Date(currentStart);
  currentEnd.setDate(currentStart.getDate() + 11);
  // 14 calendar days but ends Friday (Mon–Fri ×2)

  const daysRemaining = Math.max(0, Math.ceil((currentEnd - today) / msPerDay));

  const format = (date) =>
    date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    });

  return {
    number: currentNumber,
    startDate: format(currentStart),
    endDate: format(currentEnd),
    status: daysRemaining === 0 ? "Ended" : `${daysRemaining} days remaining`,
  };
};
