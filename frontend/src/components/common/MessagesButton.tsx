"use client";
import { ExpandIcon, NewMessageIcon } from "@/utils/icons";
import { usePathname } from "next/navigation";
import React from "react";

const MessagesButton = () => {
  const pathname = usePathname();
  const excludedRoutes = ["/messages", "/i/grok", "/jobs"];

  // Don't render MessagesButton on excluded routes
  if (excludedRoutes.includes(pathname)) return null;

  return (
    <div className="messages-button fixed bottom-0 right-5 z-10 hidden h-[53px] w-[400px] cursor-pointer rounded-t-2xl bg-white shadow-glow lg:block dark:bg-black">
      <div className="ml-1 flex w-full items-center justify-between p-3.5">
        <h1 className="text-xl font-bold text-primaryText">Messages</h1>
        <div className="mr-3.5 flex gap-4">
          <NewMessageIcon
            width="20"
            height="20"
            fill="fill-black dark:fill-white"
          />
          <ExpandIcon
            width="20"
            height="20"
            fill="fill-black dark:fill-white"
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesButton;
