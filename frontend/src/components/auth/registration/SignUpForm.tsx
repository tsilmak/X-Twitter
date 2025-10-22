"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { isValidEmail } from "@/utils/validateEmail";
import SettingsConsentForm from "./SettingsConsentForm";
import Input from "@/components/form/Input";
import Snackbar from "@/components/common/Snackbar";
import Button from "@/components/form/Button";
import { ApiExceptions } from "@/@types";
import Modal from "@/components/common/Modal";
import Link from "next/link";

/**
 * SignUpForm component
 * @param isModal - Determines the rendering context:
 *   - true: User navigated from root page (intercepting route), displays as modal with transparent background overlay
 *   - false: User accessed directly via URL, page refresh, browser search, or external link - displays as full page
 */
export default function SignUpForm({ isModal = false }) {
  const router = useRouter();

  React.useEffect(() => {
    // Update page metadata dynamically (required for modal since intercepting routes don't update metadata)
    const originalTitle = document.title;
    const originalDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");
    const originalOgTitle = document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute("content");
    const originalOgDescription = document
      .querySelector('meta[property="og:description"]')
      ?.getAttribute("content");

    document.title = "Sign up for X / X";

    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute(
      "content",
      "From breaking news and entertainment to sports and politics, get the full story with all the live commentary."
    );

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (!ogTitleMeta) {
      ogTitleMeta = document.createElement("meta");
      ogTitleMeta.setAttribute("property", "og:title");
      document.head.appendChild(ogTitleMeta);
    }
    ogTitleMeta.setAttribute("content", "Sign up for X / X");

    let ogDescriptionMeta = document.querySelector(
      'meta[property="og:description"]'
    );
    if (!ogDescriptionMeta) {
      ogDescriptionMeta = document.createElement("meta");
      ogDescriptionMeta.setAttribute("property", "og:description");
      document.head.appendChild(ogDescriptionMeta);
    }
    ogDescriptionMeta.setAttribute(
      "content",
      "From breaking news and entertainment to sports and politics, get the full story with all the live commentary."
    );

    if (isModal) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overscrollBehaviorY = "none";
    }

    return () => {
      // Restore original metadata
      document.title = originalTitle || "X";
      if (descriptionMeta && originalDescription) {
        descriptionMeta.setAttribute("content", originalDescription);
      }
      if (ogTitleMeta && originalOgTitle) {
        ogTitleMeta.setAttribute("content", originalOgTitle);
      }
      if (ogDescriptionMeta && originalOgDescription) {
        ogDescriptionMeta.setAttribute("content", originalOgDescription);
      }

      document.documentElement.style.overflow = "";
      document.documentElement.style.overscrollBehaviorY = "";
    };
  }, [isModal]);

  if (!isModal) {
    return (
      <SignUpFormContent onClose={() => router.push("/")} isModal={isModal} />
    );
  }
  return <SignUpFormContent onClose={() => router.back()} isModal={isModal} />;
}

function SignUpFormContent({
  onClose,
  isModal,
}: {
  onClose: () => void;
  isModal: boolean;
}) {
  React.useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overscrollBehaviorY = "none";
    };
  }, []);

  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [errorException, setErrorException] =
    React.useState<ApiExceptions | null>(null);
  const [showConsentForm, setShowConsentForm] = React.useState<boolean>(false);
  const [selectedDay, setSelectedDay] = React.useState<string>("");
  const [isDayFocused, setIsDayFocused] = React.useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [isMonthFocused, setIsMonthFocused] = React.useState<boolean>(false);
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [isYearFocused, setIsYearFocused] = React.useState<boolean>(false);
  const [userName, setUserName] = React.useState<string>("");
  const [userEmail, setUserEmail] = React.useState<string>("");
  const [nameTouched, setNameTouched] = React.useState<boolean>(false);
  const [emailTouched, setEmailTouched] = React.useState<boolean>(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const getDaysInMonth = (month: string, year: string) => {
    if (!month || !year) return Array.from({ length: 31 }, (_, i) => i + 1);
    const monthIndex = months.indexOf(month);
    const yearNum = parseInt(year);
    if (monthIndex === 1) {
      const isLeapYear =
        (yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0;
      return Array.from({ length: isLeapYear ? 29 : 28 }, (_, i) => i + 1);
    }
    if ([3, 5, 8, 10].includes(monthIndex)) {
      return Array.from({ length: 30 }, (_, i) => i + 1);
    }
    return Array.from({ length: 31 }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);

  React.useEffect(() => {
    if (selectedDay && days.length) {
      const maxDays = days.length;
      const selectedDayNum = parseInt(selectedDay);
      if (selectedDayNum > maxDays) setSelectedDay("");
    }
  }, [selectedMonth, selectedYear, selectedDay, days.length]);

  const getMonthNumber = (monthName: string): string => {
    const monthIndex = months.indexOf(monthName) + 1;
    return monthIndex.toString().padStart(2, "0");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setShowConsentForm(true);
  };

  const handleBack = (
    message: string,
    exception: ApiExceptions | null,
    prevName: string,
    prevEmail: string,
    prevBirthDate: string
  ) => {
    setShowConsentForm(false);
    if (message) setErrorMessage(message);
    if (exception) setErrorException(exception);
    setUserName(prevName);
    setUserEmail(prevEmail);
    const [year, monthNum, day] = prevBirthDate.split("-");
    setSelectedYear(year);
    setSelectedMonth(months[parseInt(monthNum) - 1]);
    setSelectedDay(day.replace(/^0+/, ""));
    setNameTouched(true);
    setEmailTouched(true);
  };

  if (showConsentForm) {
    return (
      <SettingsConsentForm
        name={userName}
        email={userEmail}
        birthDate={`${selectedYear}-${getMonthNumber(
          selectedMonth
        )}-${selectedDay.padStart(2, "0")}`}
        onBack={handleBack}
        isModal={isModal}
      />
    );
  }

  return (
    <Modal
      isModal={isModal}
      onClose={onClose}
      footer={
        <>
          {errorMessage &&
            errorException !== ApiExceptions.EmailAlreadyTakenException && (
              <div className="mb-4">
                <Snackbar isError={true} message={errorMessage} />
              </div>
            )}
          <form onSubmit={handleSubmit}>
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={
                selectedDay === "" ||
                selectedMonth === "" ||
                selectedYear === "" ||
                !userName ||
                !userEmail ||
                (nameTouched && userName === "") ||
                (emailTouched && !isValidEmail(userEmail)) ||
                errorException === ApiExceptions.EmailAlreadyTakenException
              }
            >
              Next
            </Button>
          </form>
        </>
      }
    >
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        Create your account
      </h1>
      <div className="relative mb-8 w-full">
        <Input
          inputId="userName"
          inputNamePlaceHolder="Name"
          value={userName}
          onChange={(value) => {
            setUserName(value);
            setNameTouched(true);
          }}
          showCharCount={true}
          maxCharLength={50}
          isInputTextValid={!nameTouched || userName.length > 0}
          inputTextInvalidText="What's your name?"
          isInputNumeric={false}
        />
      </div>
      <div className="relative mb-8 w-full">
        <Input
          inputId="userEmail"
          inputNamePlaceHolder="Email"
          value={userEmail}
          onChange={(value) => {
            setUserEmail(value);
            setEmailTouched(true);
            setErrorMessage("");
            setErrorException(null);
          }}
          maxCharLength={255}
          isInputTextValid={
            !emailTouched ||
            (isValidEmail(userEmail) &&
              errorException !== ApiExceptions.EmailAlreadyTakenException)
          }
          inputTextInvalidText={
            errorException === ApiExceptions.EmailAlreadyTakenException
              ? ""
              : errorMessage || "Please enter a valid email."
          }
          isInputNumeric={false}
        />
        {errorException === ApiExceptions.EmailAlreadyTakenException && (
          <span className="mt-1 text-sm text-red-700">
            {errorMessage}{" "}
            <Link
              href="/i/flow/login"
              className="text-primaryBlue hover:underline"
            >
              Go to login
            </Link>
          </span>
        )}
      </div>
      <div>
        <h1 className="mt-8 font-bold">Date of birth</h1>
        <p className="mt-1.5 text-sm leading-4 text-textSecondary">
          This will not be shown publicly. Confirm your own age, even if this
          account is for a business, a pet, or something else.
        </p>
        <div className="mt-5 flex gap-3">
          <div
            className={`relative w-[50%] rounded bg-white dark:bg-black ${
              isMonthFocused
                ? "border-2 border-focusBorder p-0"
                : "border border-borderColor p-[1px]"
            }`}
            onFocus={() => setIsMonthFocused(true)}
            onBlur={() => setIsMonthFocused(false)}
          >
            <label
              className={`${
                isMonthFocused ? "text-primaryBlue" : "text-gray-500"
              }`}
            >
              <span className="mx-2 text-sm">Month</span>
            </label>
            <select
              className="w-full cursor-pointer appearance-none border-none bg-transparent px-2 text-[15px] text-gray-900 outline-none dark:bg-black dark:text-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option disabled value=""></option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="rgb(83, 100, 113)"
            >
              <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z" />
            </svg>
          </div>
          <div
            className={`relative w-[25%] rounded bg-white dark:bg-black ${
              isDayFocused
                ? "border-2 border-focusBorder p-0"
                : "border border-borderColor p-[1px]"
            }`}
            onFocus={() => setIsDayFocused(true)}
            onBlur={() => setIsDayFocused(false)}
          >
            <label
              className={`${
                isDayFocused ? "text-primaryBlue" : "text-gray-500"
              }`}
            >
              <span className="mx-2 text-sm">Day</span>
            </label>
            <select
              className="w-full cursor-pointer appearance-none border-none bg-transparent px-2 text-gray-900 outline-none dark:bg-black dark:text-white"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option disabled value=""></option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="rgb(83, 100, 113)"
            >
              <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z" />
            </svg>
          </div>
          <div
            className={`relative w-[25%] rounded bg-white dark:bg-black ${
              isYearFocused
                ? "border-2 border-focusBorder p-0"
                : "border border-borderColor p-[1px]"
            }`}
            onFocus={() => setIsYearFocused(true)}
            onBlur={() => setIsYearFocused(false)}
          >
            <label
              className={`${
                isYearFocused ? "text-primaryBlue" : "text-gray-500"
              }`}
            >
              <span className="mx-1.5 text-sm">Year</span>
            </label>
            <select
              className="w-full cursor-pointer appearance-none border-none bg-transparent px-2 text-gray-900 outline-none dark:bg-black dark:text-white"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option disabled value=""></option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="rgb(83, 100, 113)"
            >
              <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z" />
            </svg>
          </div>
        </div>
      </div>
    </Modal>
  );
}
