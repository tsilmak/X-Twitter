import { XLogo } from "@/utils/icons";
import GoogleSignUpButton from "@/components/buttons/GoogleSignUpButton";
import AppleSignUpButton from "@/components/buttons/AppleSignUpButton";
import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "X. It's what's happening / X",
  description: "X App",
  openGraph: {
    title: "X. It's what's happening",
    description:
      "From breaking news and entertainment to sports and politics, get the full story with all the live commentary.",
    siteName: "X (formerly Twitter)",
    type: "website",
    url: `${process.env.WEBSITE_URL}`,
    images: [
      {
        url: `${process.env.MAIN_IMAGE_URL}`,
        alt: "X Social Platform",
      },
    ],
  },
};
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <div className="mb-24 mt-4 flex items-center justify-center md:mb-44 md:mt-52">
        <div className="grid w-full max-w-7xl grid-cols-1 md:grid-cols-2 md:gap-10">
          <div className="mt-0 flex w-full justify-center md:mt-12">
            <div className="h-[160px] w-[90px] md:h-[370px] md:w-[400px]">
              <XLogo
                width="100%"
                height="100%"
                fill="fill-black dark:fill-white"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="mx-auto w-full max-w-[320px] px-2 text-center md:ml-24 md:mt-[-40px] md:max-w-[400px] md:px-0 md:text-left lg:max-w-[450px] xl:max-w-[525px]">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-4xl lg:text-6xl">
              Happening now
            </h1>
            <h2 className="mt-10 text-2xl font-extrabold sm:text-3xl md:mt-14 md:text-3xl">
              Join today.
            </h2>
            <div className="mt-6 md:mt-8">
              <div>
                <div className="mb-2">
                  <GoogleSignUpButton />
                </div>
                <div className="mb-2">
                  <AppleSignUpButton />
                </div>
              </div>
              <div className="mb-2 flex items-center">
                <hr className="h-[1px] max-w-[140px] flex-1 border-none bg-[#2F3336]" />
                <p className="mx-2 text-sm">or</p>
                <hr className="h-[1px] max-w-[140px] flex-1 border-none bg-[#2F3336]" />
              </div>
              <div>
                <Link
                  href={"/i/flow/signup"}
                  className="inline-block w-full max-w-[300px]"
                >
                  <button className="w-full max-w-[300px] rounded-full bg-[#1d9bf0] px-2 py-2 text-[15px] font-bold text-white hover:bg-[#1a8cd8]">
                    Create account
                  </button>
                </Link>
              </div>
              <div>
                <p className="mt-1.5 w-full max-w-[300px] text-[11px] leading-3 text-[#71767b]">
                  By signing up, you agree to the{" "}
                  <span className="text-[#117dd6] hover:cursor-pointer hover:text-[#1585d9] hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#117dd6] hover:cursor-pointer hover:text-[#1585d9] hover:underline">
                    Privacy Policy
                  </span>
                  , including{" "}
                  <span className="text-[#117dd6] hover:cursor-pointer hover:text-[#1585d9] hover:underline">
                    Cookie Use
                  </span>
                  .
                </p>
              </div>
            </div>
            <div className="mt-10 md:mt-14">
              <h2 className="mb-4 font-bold">Already have an account?</h2>
              <Link
                href="/i/flow/login"
                className="inline-block w-full max-w-[300px]"
              >
                <button className="w-full rounded-full border border-borderColor bg-transparent px-2 py-2 text-[15px] font-bold text-[#178fe5] hover:bg-[#e8f5fd] dark:hover:bg-[#031018]">
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="flex flex-row flex-wrap justify-center gap-4 px-2 pb-3 pt-3 text-[12px] text-[#71767b] sm:px-4 sm:text-[14px]">
        <span>About</span>
        <span>Download the X app</span>
        <span>Help Center</span>
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Cookie Policy</span>
        <span>Accessibility</span>
        <span>Ads info</span>
        <span>Blog</span>
        <span>Careers</span>
        <span>Brand Resources</span>
        <span>Advertising</span>
        <span>Marketing</span>
        <span>X for Business</span>
        <span>Developers</span>
        <span>Directory</span>
        <span>Settings</span>
        <span>© 2025 X Corp.</span>
      </footer>
    </div>
  );
}
