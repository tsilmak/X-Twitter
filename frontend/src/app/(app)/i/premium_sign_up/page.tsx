"use client";
import { CloseIcon } from "@/utils/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const PremiumSignUp = () => {
  const [selectedPlan, setSelectedPlan] = React.useState<"annual" | "monthly">(
    "annual"
  );

  const router = useRouter();

  interface CloseHandlerEvent {
    preventDefault: () => void;
  }

  const handleClose = (e: CloseHandlerEvent): void => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex h-full w-full flex-col bg-black">
        {/* Subtle light gradient overlay */}
        <div
          className="absolute top-[-300px] z-10 min-h-[650px] w-full"
          style={{
            background:
              "radial-gradient(56.1514% 56.1514% at 49.972% 38.959%, #273649 0%, #000000 100%)",
          }}
        />
        {/* Information content */}
        <div className="relative z-10 flex items-center justify-center py-6">
          <div className="text-center">
            <h1 className="mb-3 mt-8 text-2xl font-bold text-neutral-200 sm:mb-4 sm:mt-6 sm:text-5xl xl:text-5xl 2xl:mt-36 2xl:text-6xl">
              Upgrade to Premium
            </h1>
            <p className="text-sm text-[#b0b2b5] sm:text-lg xl:text-lg 2xl:text-xl">
              Enjoy an enhanced experience, exclusive creator tools, top-tier
              verification and security.
              <br />
              (For organizations,{" "}
              <Link
                href={"/i/organizations"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="font-bold text-white underline">
                  sign up here
                </span>
              </Link>
              )
            </p>
            {/* Plan Annual or Monthly */}

            <div className="mx-auto mt-4 flex w-72 items-center justify-center rounded-full bg-[#202327] p-0.5 text-white sm:mt-6 2xl:mt-20">
              <div
                className={`flex-1 cursor-pointer rounded-full py-1 transition-colors duration-200 ${
                  selectedPlan === "annual" ? "bg-black" : ""
                }`}
                onClick={() => setSelectedPlan("annual")}
              >
                <span className="text-sm font-bold">Annual</span>{" "}
                <span className="rounded-full bg-[#00251a] p-1 text-xs font-bold text-[#c2f1dc]">
                  Best Value
                </span>
              </div>
              <div
                className={`flex-1 cursor-pointer rounded-full py-1 transition-colors duration-200 ${
                  selectedPlan === "monthly" ? "bg-black" : ""
                }`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <span className="text-sm font-bold">Monthly</span>
              </div>
            </div>
            {/* Card options */}
            <div className="z-10 mt-8 grid grid-cols-3 gap-4">
              <div className="h-[445px] w-[325px] rounded-lg bg-[#00251a]">
                ssssssss
              </div>
              <div className="h-[445px] w-[325px] rounded-lg bg-[#00251a]">
                ssssssss
              </div>
              <div className="h-[445px] w-[325px] rounded-lg bg-[#00251a]">
                ssssssss
              </div>
            </div>
          </div>
        </div>
        {/* Top left close button */}
        <div>
          <button
            onClick={handleClose}
            className="hover:transition-delay-150 absolute left-4 top-4 z-40 rounded-full p-2 text-white transition duration-200 hover:bg-[#1c1d1f]"
            aria-label="Close modal"
          >
            <CloseIcon width={"20"} height={"20"} fill={"white"} />
          </button>
        </div>

        {/* Fixed bottom card with information chosen */}
        <div className="fixed bottom-0 left-0 right-0 z-10 hidden h-40 border-t border-[rgb(32,35,39)] bg-black/95 p-3 text-white sm:flex">
          {/* Plan Information */}
          <div className="rounded-lg p-8">
            <div className="flex max-w-lg flex-col justify-center">
              <h1 className="mb-3 text-xl font-thin tracking-tighter">Basic</h1>
              <div className="flex flex-row items-end">
                <span className="mb-0 text-3xl font-semibold">€39.36</span>
                <span className="mb-1 ml-1">
                  / {selectedPlan === "annual" ? "year" : "month"}
                </span>
              </div>
              <p className="mt-2 text-sm">
                Billed {selectedPlan === "annual" ? "annually" : "monthly"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumSignUp;
