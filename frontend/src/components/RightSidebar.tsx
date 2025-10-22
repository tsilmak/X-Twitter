import React from "react";

const RightSidebar = () => {
  return (
    <div className="z-40 mr-4 hidden w-[350px] pl-4 lg:block">
      {/* Search */}
      <div className="sticky top-0 bg-white py-1 backdrop-blur-md dark:bg-black">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full border border-borderColor bg-white px-4 py-2 text-white focus:border-[#1d9bf0] focus:outline-none dark:bg-black"
        />
      </div>

      {/* Subscribe to Premium */}
      <div className="mt-1 rounded-2xl border border-borderColor bg-white p-3 dark:bg-black">
        <h2 className="mb-1.5 text-xl font-bold">Subscribe to Premium</h2>
        <p className="leading-2 font-light text-[#0f1419] dark:text-white">
          Subscribe to unlock new features and if eligible, receive a share of
          revenue.
        </p>
        <button className="mt-2 justify-start rounded-full bg-[#1d9bf0] px-4 py-1.5 font-bold text-white hover:bg-[#1a8cd8]">
          Subscribe
        </button>
      </div>

      {/* Who to Follow */}
      <div className="mt-4 rounded-2xl border border-borderColor bg-white dark:bg-black">
        <h2 className="mx-1.5 p-2.5 text-xl font-bold text-black dark:text-white">
          Who to follow
        </h2>
        <div>
          <div className="flex w-full items-center justify-between px-4 py-2 hover:bg-[#f7f7f7] dark:hover:bg-[#080808]">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-600" />
              <div>
                <p className="font-bold">Countdown ⏳</p>
                <p className="text-gray-500">@Countdown</p>
              </div>
            </div>
            <button className="rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white hover:bg-[#272c30] dark:bg-white dark:text-black">
              Follow
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-[#f7f7f7] dark:hover:bg-[#080808]">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-600" />
              <div>
                <p className="font-bold">Countdown ⏳</p>
                <p className="text-gray-500">@Countdown</p>
              </div>
            </div>
            <button className="rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white hover:bg-[#272c30] dark:bg-white dark:text-black">
              Follow
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-[#f7f7f7] dark:hover:bg-[#080808]">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-600" />
              <div>
                <p className="font-bold">Countdown ⏳</p>
                <p className="text-gray-500">@Countdown</p>
              </div>
            </div>
            <button className="rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white hover:bg-[#272c30] dark:bg-white dark:text-black">
              Follow
            </button>
          </div>
        </div>
        <div className="cursor-pointer rounded-b-2xl hover:bg-[#f7f7f7] dark:hover:bg-[#080808]">
          <button className="mx-4 my-4 text-[#1d9bf0]">Show more</button>
        </div>
      </div>

      {/* Trending Now */}
      <div className="mt-4 rounded-xl border border-borderColor bg-white p-4 dark:bg-black">
        <h2 className="text-xl font-bold">What&apos;s happening</h2>
        <div className="mt-4">
          <div className="mt-2">
            <p className="font-bold">Grok 3 is here. Try it for free.</p>
            <p className="text-gray-500">LIVE</p>
          </div>
          <div className="mt-2">
            <p className="text-gray-500">Trending in Portugal</p>
            <p className="font-bold">Tiago Grila</p>
          </div>
          <div className="mt-2">
            <p className="text-gray-500">Trending in Portugal</p>
            <p className="font-bold">Ruy de Carvalho</p>
          </div>
          <div className="mt-2">
            <p className="text-gray-500">Trending in Portugal</p>
            <p className="font-bold">Peculiar</p>
            <p className="text-gray-500">4,242 posts</p>
          </div>
          <div className="mt-2">
            <p className="text-gray-500">Trending in Portugal</p>
            <p className="font-bold">Hugo Soares</p>
          </div>
        </div>
        <button className="mt-2 text-[#1d9bf0]">Show more</button>
      </div>

      {/* Footer Links */}
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500">
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline">
          Cookie Policy
        </a>
        <a href="#" className="hover:underline">
          Accessibility
        </a>
        <a href="#" className="hover:underline">
          Ads info
        </a>
        <span>More etc etc you know how X is</span>
      </div>
    </div>
  );
};

export default RightSidebar;
