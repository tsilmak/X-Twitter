"use client";

import { useRouter } from "next/navigation";
import GoogleSignUpButton from "../buttons/GoogleSignUpButton";
import AppleSignUpButton from "../buttons/AppleSignUpButton";
import React from "react";
import Input from "../form/Input";
import Modal from "../common/Modal";

export default function LoginForm({ isModal = false }) {
  const router = useRouter();

  // Apply overflow: hidden and overscroll-behavior-y: none to html when modal is open
  React.useEffect(() => {
    if (isModal) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overscrollBehaviorY = "none";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.overscrollBehaviorY = "";
    };
  }, [isModal]);

  if (!isModal) {
    return (
      <LoginFormContent onClose={() => router.push("/")} isModal={isModal} />
    );
  }

  // If Modal render with backdrop
  return <LoginFormContent onClose={() => router.back()} isModal={isModal} />;
}
function LoginFormContent({
  onClose,
  isModal,
}: {
  onClose: () => void;
  isModal: boolean;
}) {
  return (
    <Modal
      isModal={isModal}
      onClose={onClose}
      showCloseButton={true}
      contentClassName="px-8 pb-8"
    >
      <h1 className="mb-6 text-3xl font-bold text-black dark:text-white">
        Sign in to X
      </h1>

      <div className="mb-3 space-y-3">
        {/* Google login button */}
        {/* TODO CHANGE IT TO LOGIN */}
        <div className="mb-6">
          <GoogleSignUpButton />
        </div>

        {/* Apple login button */}
        <AppleSignUpButton />
      </div>

      {/* Divider */}
      <div className="my-4 flex items-center">
        <hr className="h-[1px] flex-1 border-none bg-[#cfd9de] dark:bg-[#2F3336]" />
        <p className="mx-2 text-sm">or</p>
        <hr className="h-[1px] flex-1 border-none bg-[#cfd9de] dark:bg-[#2F3336]" />
      </div>

      {/* Email/phone input */}
      <div className="mb-8">
        <Input
          inputId={"userIdentification"}
          inputNamePlaceHolder={"Phone, email address, or username"}
          onChange={function (): void {
            throw new Error("Function not implemented.");
          }}
          maxCharLength={0}
          isInputTextValid={false}
          isInputNumeric={false}
        />
      </div>

      {/* Next button */}
      <button className="mb-4 w-full rounded-full bg-black py-1.5 font-bold text-white hover:bg-[#272c30] dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Next
      </button>

      {/* Forgot password */}
      <button className="mt-3 w-full rounded-full border border-borderColor py-1.5 font-bold text-black hover:bg-[#e7e7e8] dark:text-white dark:hover:bg-gray-900">
        Forgot password?
      </button>

      {/* Sign up prompt */}
      <p className="mt-8 text-gray-500">
        Dont have an account?{" "}
        <a href="#" className="text-[#1d9bf0] hover:underline">
          Sign up
        </a>
      </p>
    </Modal>
  );
}
