export function DifficultyDots({ difficulty }: { difficulty: string }) {
  const level = difficulty.toLowerCase();
  const dotCount = level === "easy" ? 1 : level === "medium" ? 2 : 3;
  const color =
    level === "easy"
      ? "bg-green-500"
      : level === "medium"
        ? "bg-amber-500"
        : "bg-red-500";
  const textColor =
    level === "easy"
      ? "text-green-500"
      : level === "medium"
        ? "text-amber-500"
        : "text-red-500";

  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full inline-block ${
              i <= dotCount ? color : "bg-muted"
            }`}
          />
        ))}
      </span>
      <span className={`${textColor} font-bold text-xs uppercase`}>
        {level}
      </span>
    </span>
  );
}
