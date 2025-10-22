"use client";
import React, { useState, useEffect } from "react";

import {
  useSendEmailConfirmationCodeMutation,
  useVerifyEmailConfirmationCodeMutation,
} from "@/app/lib/api/authApi";
import PasswordUpdateForm from "./PasswordUpdateForm";
import Input from "@/components/form/Input";
import { extractApiError } from "@/utils/apiErrorHandler";
import Modal from "@/components/common/Modal";
import Button from "@/components/form/Button";

type CodeConfirmationFormProps = {
  email: string;
  username: string;
  isModal: boolean;
  emailFailedCode?: string;
};

const CodeConfirmationForm: React.FC<CodeConfirmationFormProps> = ({
  email,
  isModal,
  username,
  emailFailedCode = "123456",
}) => {
  const [
    resendEmailConfirmationCode,
    { isLoading: isLoadingResendEmailConfirmationCode },
  ] = useSendEmailConfirmationCodeMutation();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isInputError, setIsInputError] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [resendText, setResendText] = useState<string>("Check your spam inbox");
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [cooldownTime, setCooldownTime] = useState<number>(60); // 1 minute in seconds
  const [isInCooldown, setIsInCooldown] = useState<boolean>(true);

  const [confirmCode, { isLoading }] = useVerifyEmailConfirmationCodeMutation();
  const [showSetPasswordForm, setShowPasswordForm] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isInCooldown && cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setIsResendDisabled(false);
            setIsInCooldown(false);
            setResendText("Didn't receive an email?");
            clearInterval(timer);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCooldown, cooldownTime]);

  const handleConfirmUserAccount = async () => {
    try {
      await confirmCode({ code, username }).unwrap();
      setShowPasswordForm(true);
    } catch (err) {
      console.error("Confirmation failed:", err);

      // Extract API error message
      const apiError = extractApiError(err);

      if (apiError && apiError.data.error) {
        // Use the error message from the API
        setErrorMessage(apiError.data.error);
      } else {
        // Default error message
        setErrorMessage(
          "Email confirmation failed. Please try again or request a new code."
        );
      }

      setIsInputError(true);
    }
  };

  // Clears the error when the user starts typing
  const handleCodeChange = (value: string) => {
    setCode(value);
    if (isInputError) {
      setIsInputError(false);
    }
  };

  const handleGoBack = () => {
    window.location.href = "/i/flow/login";
  };

  const handleResendEmail = () => {
    if (isResendDisabled) return;

    resendEmailConfirmationCode({ username });

    setIsResendDisabled(true);
    setIsInCooldown(true);
    setCooldownTime(60); // Reset to 1 minute
    setResendText("Check your spam inbox");
  };

  const formatCooldownTime = () => {
    const minutes = Math.floor(cooldownTime / 60);
    const seconds = cooldownTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (showSetPasswordForm) {
    return <PasswordUpdateForm isModal={isModal} username={username} />;
  }

  return (
    <Modal
      isModal={isModal}
      onClose={handleGoBack}
      showCloseButton={false}
      showBackButton={true}
      contentClassName="px-8 md:px-20 pb-72 md:pb-64 overflow-y-auto"
      footer={
        <Button
          onClick={handleConfirmUserAccount}
          variant="primary"
          size="large"
          disabled={!code || isLoading}
        >
          {isLoading ? "Loading..." : "Confirm"}
        </Button>
      }
    >
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">
        We sent you a code
      </h1>
      {emailFailedCode ? (
        <div className="mb-4 rounded-lg border border-yellow-400 bg-yellow-100 p-4 dark:border-yellow-700 dark:bg-yellow-900/30">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Looks like the email was not sent. The code for registration is:{" "}
            <strong>{emailFailedCode}</strong>
            <br />
            <br />
            <strong
              className="cursor-pointer underline"
              onClick={() =>
                window.open(
                  "/resources/templates/email-verification-code-template.html",
                  "_blank"
                )
              }
            >
              Click here to see the email template for email verification
            </strong>
          </p>
        </div>
      ) : null}
      <p className="mb-4">Enter it below to verify {email}.</p>
      <Input
        inputId={"code"}
        inputNamePlaceHolder={"Verification code"}
        maxCharLength={6}
        onChange={handleCodeChange}
        isInputTextValid={!isInputError}
        inputTextInvalidText={errorMessage}
        isInputNumeric={true}
      />
      <div className="ml-1 mt-0.5 flex items-center text-sm dark:text-neutral-400">
        <button
          onClick={handleResendEmail}
          disabled={isResendDisabled}
          className={`hover:text-blue-400 hover:underline ${
            isResendDisabled
              ? "cursor-not-allowed opacity-80"
              : "cursor-pointer"
          }`}
        >
          {isLoadingResendEmailConfirmationCode ? "Sending..." : resendText}
        </button>
        {isInCooldown && (
          <span className="ml-2 text-neutral-500">
            ({formatCooldownTime()})
          </span>
        )}
      </div>
    </Modal>
  );
};

export default CodeConfirmationForm;
