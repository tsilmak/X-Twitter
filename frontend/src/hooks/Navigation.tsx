"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import MobileSidebar from "../components/Sidebar/Mobile/MobileSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";

//  hook to detect screen size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{ width: number }>({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const Navigation = () => {
  const { username } = useSelector((state: RootState) => state.user);

  const { width } = useWindowSize();
  const breakpoint = 640;

  return width < breakpoint ? (
    <MobileSidebar />
  ) : (
    <Sidebar username={username} />
  );
};

export default Navigation;
