"use client";
import React, { createContext, useContext, useState } from "react";

// Create a context to share tab state
export const TabContext = createContext({
  selectedTab: "For you",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSelectedTab: (_value: string) => {},
});

// Provider component
export const TabProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedTab, setSelectedTab] = useState("For you");

  return (
    <TabContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </TabContext.Provider>
  );
};

// Custom hook to use the tab context
export const useTabContext = () => useContext(TabContext);

// Tab component
const Tab = () => {
  const { selectedTab, setSelectedTab } = useTabContext();

  return (
    <div className="sticky top-0 border-b border-borderColor bg-opacity-80 text-sm backdrop-blur-md dark:bg-black">
      <div className="flex">
        <button
          className="relative w-1/2 py-3 text-center transition-colors duration-200 hover:bg-[#e7e7e8] dark:hover:bg-colorHover"
          onClick={() => setSelectedTab("For you")}
        >
          {selectedTab === "For you" && (
            <div className="absolute bottom-0 left-1/2 w-[55px] -translate-x-1/2 transform rounded-full border-b-4 border-sky-500"></div>
          )}
          <h1
            className={`my-1 font-bold ${
              selectedTab === "For you" ? "" : "text-[#6c7075]"
            }`}
          >
            For you
          </h1>
        </button>
        <button
          className="relative w-1/2 py-3 text-center transition-colors duration-200 hover:bg-[#e7e7e8] dark:hover:bg-colorHover"
          onClick={() => setSelectedTab("Following")}
        >
          {selectedTab === "Following" && (
            <div className="absolute bottom-0 left-1/2 w-[55px] -translate-x-1/2 transform rounded-b-full border-b-4 border-sky-500"></div>
          )}
          <h1
            className={`my-1 font-bold ${
              selectedTab === "Following" ? "" : "text-[#6c7075]"
            }`}
          >
            Following
          </h1>
        </button>
      </div>
    </div>
  );
};

export default Tab;
