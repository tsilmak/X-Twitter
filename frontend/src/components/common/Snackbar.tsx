import React from "react";

type SnackBarProps = {
  isError: boolean;
  message: string;
};

const Snackbar = ({ isError, message }: SnackBarProps) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  return (
    <div
      className={`duration-250 rounded-md px-4 py-3 shadow-lg transition-all ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} ${
        isError
          ? "border border-red-700/20 bg-[#f4212e] text-white dark:bg-[#f4212e]"
          : "border border-blue-600/20 bg-[#1d9bf0] text-white dark:bg-[#1d9bf0]"
      } `}
    >
      <div className="flex items-center gap-3">
        {isError ? (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 flex-shrink-0"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 flex-shrink-0"
            fill="currentColor"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        )}
        <span className="flex-1 text-sm font-medium leading-tight md:text-base">
          {message}
        </span>
      </div>
    </div>
  );
};

export default Snackbar;
