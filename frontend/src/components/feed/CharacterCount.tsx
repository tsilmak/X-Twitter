const CharacterCounter = ({
  inputText,
  maxLength,
}: {
  inputText: string;
  maxLength: number;
}) => {
  const currentLength = inputText.length;
  const percentage = Math.min((currentLength / maxLength) * 100, 100);

  // Calculate colors based on percentage
  const getColor = () => {
    if (currentLength >= 280) return "#FF0000"; // Red when close to limit
    if (currentLength >= 280 - 20) return "#FFAA00"; // Orange for warning
    return "#1DA1F2";
  };

  // Calculate stroke dasharray and dashoffset for the circle
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (percentage / 100) * circumference;
  return (
    <>
      {currentLength > 0 && (
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <div className="flex w-full items-center justify-end">
            <div className="relative mr-4">
              <svg
                className={`transition-all duration-300 ease-in-out ${
                  currentLength >= 280 - 20 ? "animate-scale-up" : ""
                }`}
                width={`${currentLength >= 280 - 20 ? "35" : "30"}`}
                height={`${currentLength >= 280 - 20 ? "35" : "30"}`}
                viewBox="0 0 30 30"
              >
                {/* Background circle */}
                {currentLength < 280 + 11 && (
                  <circle
                    cx="15"
                    cy="15"
                    r={radius}
                    stroke="rgba(47,51,54,255)"
                    strokeWidth="3"
                    fill="none"
                    className={
                      currentLength < 280 + 10
                        ? "opacity-100 transition-opacity duration-300"
                        : "opacity-0 transition-opacity duration-300"
                    }
                  />
                )}

                {/* Progress circle */}
                {currentLength < 280 + 11 && (
                  <circle
                    cx="15"
                    cy="15"
                    r={radius}
                    stroke={getColor()}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    transform="rotate(-90 15 15)"
                    className={
                      currentLength < 280 + 10
                        ? "opacity-100 transition-opacity duration-300"
                        : "opacity-0 transition-opacity duration-300"
                    }
                  />
                )}

                {/* Show number when getting close */}
                {currentLength >= 280 - 20 && (
                  <text
                    x="15"
                    y="15"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="12"
                    fill={getColor()}
                  >
                    {maxLength - currentLength}
                  </text>
                )}
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterCounter;
