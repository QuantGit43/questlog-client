interface HeartDisplayProps {
  currentHp: number; // 0–100
}

const MAX_HP = 100;
const HEARTS_COUNT = 5;
const HP_PER_HEART = MAX_HP / HEARTS_COUNT;

export function HeartDisplay({ currentHp }: HeartDisplayProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: HEARTS_COUNT }).map((_, index) => {
        const heartMinHp = index * HP_PER_HEART;

        const filledHp = Math.min(
          Math.max(currentHp - heartMinHp, 0),
          HP_PER_HEART
        );

        const fillPercentage = (filledHp / HP_PER_HEART) * 100;

        return (
          <div
            key={index}
            className="relative w-8 h-8"
          >
            {/* Layer 1: Empty heart */}
            <img
              src="/images/heart_empty.png"
              alt="Empty heart"
              className="w-full h-full"
            />

            {/* Layer 2: Full heart (overlay, cropped) */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <img
                src="/images/heart_full.png"
                alt="Full heart"
                className="w-8 h-8 max-w-none"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
