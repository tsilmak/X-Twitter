"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ActiveHomeIcon,
  XLogo,
  SearchIcon,
  ActiveSearchIcon,
  ActiveNotificationIcon,
  NotificationIcon,
  MessageIcon,
  ActiveMessageIcon,
  ActiveProfileIcon,
  ProfileIcon,
} from "@/utils/icons";

const MobileSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      icon: pathname === "/home" ? ActiveHomeIcon : HomeIcon,
      text: "Home",
      path: "/home",
    },
    {
      icon: pathname === "/explore" ? ActiveSearchIcon : SearchIcon,
      text: "Explore",
      path: "/explore",
    },
    {
      icon:
        pathname === "/notifications"
          ? ActiveNotificationIcon
          : NotificationIcon,
      text: "Notifications",
      path: "/notifications",
    },
    {
      icon: pathname === "/messages" ? ActiveMessageIcon : MessageIcon,
      text: "Messages",
      path: "/messages",
    },
    {
      icon: pathname === "/username" ? ActiveProfileIcon : ProfileIcon,
      text: "Profile",
      path: "/username",
    },
  ];

  return (
    <>
      {/* Profile icon top */}
      <div className="w-full">
        <button
          className="fixed left-2 top-2 z-40 rounded-full border-2 border-white bg-black p-0.5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ProfileIcon />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <nav
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 transform flex-col bg-black text-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button className="self-end p-4" onClick={() => setIsOpen(false)}>
          <XLogo width={"24"} height={"24"} fill={"white"} />
        </button>

        {/* Navigation Items */}
        <ul className="flex w-full flex-col gap-2 px-4">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <li key={index}>
                <Link href={item.path} onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex items-center rounded-full p-3 hover:bg-gray-800 ${
                      isActive ? "font-bold" : ""
                    }`}
                  >
                    <item.icon />
                    <span className="ml-4 text-lg">{item.text}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Post Button */}
        <div className="mt-4 px-4">
          <button className="flex h-12 w-full items-center justify-center rounded-full bg-white font-bold text-black">
            <span>Post</span>
          </button>
        </div>

        {/* Profile Section */}
        <div className="mb-4 mt-auto px-4">
          <div className="flex items-center rounded-full p-3 hover:bg-gray-800">
            <ProfileIcon />
            <span className="ml-4 text-lg">Profile</span>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MobileSidebar;
