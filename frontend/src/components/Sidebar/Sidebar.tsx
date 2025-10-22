"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
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
  ActiveGrokIcon,
  CommunitiesIcon,
  ActiveCommunitiesIcon,
  PremiumIcon,
  VerifiedOrgIcon,
  ActiveProfileIcon,
  ProfileIcon,
  MoreIcon,
  PostIcon,
  ActivePremiumIcon,
  ActiveBookmarkIcon,
  BookmarkIcon,
  JobsIcon,
  GrokIconSidebar,
} from "@/utils/icons";

type SidebarProps = {
  username: string;
};

const Sidebar = ({ username }: SidebarProps) => {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const [windowHeight, setWindowHeight] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 1080
  );
  const [showScrollbar, setShowScrollbar] = useState<boolean>(
    typeof window !== "undefined" ? window.innerHeight <= 540 : false
  );

  // Effect to update window height on resize
  useEffect(() => {
    // Update height on resize
    const handleResize = () => {
      const height = window.innerHeight;
      setWindowHeight(height);
      setShowScrollbar(height <= 540);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const moreItems = [
    "Lists",
    "Bookmarks",
    "Monetization",
    "Ads",
    "Jobs",
    "Create your Space",
  ];

  const navItems = [
    {
      icon: pathname === "/home" ? ActiveHomeIcon : HomeIcon,
      text: "Home",
      path: "/home",
      minHeight: 0, // Always show
    },
    {
      icon: pathname === "/explore" ? ActiveSearchIcon : SearchIcon,
      text: "Explore",
      path: "/explore",
      minHeight: 0,
    },
    {
      icon:
        pathname === "/notifications"
          ? ActiveNotificationIcon
          : NotificationIcon,
      text: "Notifications",
      path: "/notifications",
      minHeight: 0,
    },
    {
      icon: pathname === "/messages" ? ActiveMessageIcon : MessageIcon,
      text: "Messages",
      path: "/messages",
      minHeight: 0,
    },
    {
      icon: pathname === "/i/grok" ? ActiveGrokIcon : GrokIconSidebar,
      text: "Grok",
      path: "/i/grok",
      minHeight: 0,
    },
    {
      icon: pathname === "/i/bookmarks" ? ActiveBookmarkIcon : BookmarkIcon,
      text: "Bookmarks",
      path: "/i/bookmarks",
      minHeight: 729, // Hide when height < 729px
    },
    {
      icon: JobsIcon,
      text: "Jobs",
      path: "/jobs",
      minHeight: 800,
    },
    {
      icon: pathname.endsWith("/communities/explore")
        ? ActiveCommunitiesIcon
        : CommunitiesIcon,
      text: "Communities",
      path: "/username/communities/explore",
      minHeight: 541,
    },
    {
      icon: pathname === "/i/premium_sign_up" ? ActivePremiumIcon : PremiumIcon,
      text: "Premium",
      path: "/i/premium_sign_up",
      minHeight: 590,
    },
    {
      icon: VerifiedOrgIcon,
      text: "Verified Orgs",
      path: "/i/organizations",
      minHeight: 685,
    },
    {
      icon: pathname === "/username" ? ActiveProfileIcon : ProfileIcon,
      text: "Profile",
      path: "/username",
      minHeight: 0,
    },
    {
      icon: MoreIcon,
      text: "More",
      path: "#",
      minHeight: 0,
    },
  ];

  // Filter nav items based on current window height
  const visibleNavItems = navItems.filter(
    (item) => windowHeight >= item.minHeight
  );

  return (
    <nav className="fixed flex h-screen w-20 flex-col items-center border-r border-borderColor bg-white text-black xl:w-64 dark:bg-black dark:text-white">
      {/* X Logo */}
      <div className="ml-5 w-full xl:ml-7">
        <button className="rounded-full p-3.5 transition-all duration-200 hover:bg-[#e7e7e8] dark:hover:bg-colorHover">
          <XLogo width={"30"} height={"30"} fill="fill-black dark:fill-white" />
        </button>
      </div>

      {/* Navigation Items - with scrollbar for small heights */}
      <ul
        className={`relative w-full flex-grow px-5 xl:ml-0 ${
          showScrollbar
            ? "overflow-y-auto overflow-x-hidden"
            : "overflow-hidden"
        }`}
      >
        {visibleNavItems.map((item, index) => {
          const isMoreItem = item.text === "More";
          const isActive =
            item.text === "Communities"
              ? pathname.endsWith("/communities/explore")
              : pathname === item.path;

          return (
            <li key={index} className="relative">
              {isMoreItem ? (
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className={`group mb-4 mt-2.5 flex w-full items-center justify-start rounded-full transition-all duration-200 xl:mt-0 ${
                    showScrollbar
                      ? "ml-1 p-0 py-1"
                      : windowHeight <= 930
                        ? "p-2 xl:p-2.5"
                        : "p-2 xl:p-4"
                  } ${
                    !showScrollbar &&
                    "hover:bg-[#e7e7e8] dark:hover:bg-colorHover"
                  }`}
                >
                  <item.icon
                    width="24"
                    height="24"
                    fill="fill-black dark:fill-white"
                  />
                  <span
                    className={`ml-0 hidden text-xl transition-colors duration-200 xl:ml-5 xl:inline dark:group-hover:text-gray-200 ${
                      isActive ? "font-bold" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                </button>
              ) : (
                <Link href={item.path} className="block">
                  <button
                    className={`group mt-2.5 flex w-full items-center justify-start rounded-full transition-all duration-200 xl:mt-0 ${
                      showScrollbar
                        ? "ml-1 p-0 py-1"
                        : windowHeight <= 930
                          ? "p-2 xl:p-2.5"
                          : "p-2 xl:p-4"
                    } ${
                      !showScrollbar &&
                      "hover:bg-[#e7e7e8] dark:hover:bg-colorHover"
                    }`}
                  >
                    <item.icon width="24" height="24" fill="white" />
                    <span
                      className={`ml-5 mr-2 hidden text-xl transition-colors duration-200 xl:inline dark:group-hover:text-gray-200 ${
                        isActive ? "font-bold" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                </Link>
              )}

              {/* More dropdown */}
              {isMoreItem && isMoreOpen && (
                <div className="absolute left-full top-0 z-40 w-64 rounded-lg border border-gray-800 bg-black shadow-lg xl:left-0 xl:mt-14">
                  {moreItems.map((moreItem, idx) => (
                    <Link
                      key={idx}
                      href={`/${moreItem.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block px-4 py-2 text-white hover:bg-gray-900"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      {moreItem}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}

        {/* Post Button */}
        <div className={`mt-2 ${showScrollbar ? "py-2" : "mr-0"} w-full`}>
          <button className="flex h-9 w-full items-center justify-center rounded-full bg-[#0f1419] font-bold text-white transition-all duration-200 hover:bg-[#272c30] xl:h-12 dark:bg-white dark:text-black dark:hover:bg-neutral-100">
            <span className="hidden xl:inline">Post</span>
            <PostIcon className="inline xl:hidden" />
          </button>
        </div>
      </ul>

      {/* Profile Section */}
      <div className="mb-4 mr-2 w-full cursor-pointer rounded-full px-3.5 hover:bg-[#e7e7e8]">
        <div className="flex items-center justify-start rounded-full p-3 transition-all duration-200 hover:bg-colorHover">
          <ProfileIcon />
          <span className="mx-4 hidden text-lg xl:inline">
            @{username ? username : "Profile bottom"}
          </span>

          <button className="hidden xl:inline">
            <MoreIcon />{" "}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
