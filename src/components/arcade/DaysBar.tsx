export function DaysBar({ days, max }: { days: number; max: number }) {
  return (
    <span className="days-bar" aria-hidden="true">
      {Array.from({ length: max }, (_, index) => (
        <i key={index} className={index < days ? undefined : "off"} />
      ))}
    </span>
  );
}
