"use client";

import React from "react";
import {
  useRegisterUserMutation,
  useSendEmailConfirmationCodeMutation,
} from "@/app/lib/api/authApi";
import Checkbox from "../../form/CheckBox";
import CodeConfirmationForm from "./CodeConfirmationForm";
import Button from "@/components/form/Button";
import { extractApiError } from "@/utils/apiErrorHandler";
import { ApiExceptions } from "@/@types";
import Modal from "@/components/common/Modal";

interface SettingsConsentFormProps {
  name: string;
  email: string;
  birthDate: string;
  onBack: (
    message: string,
    exception: ApiExceptions | null,
    name: string,
    email: string,
    birthDate: string
  ) => void;
  isModal: boolean;
}

const SettingsConsentForm: React.FC<SettingsConsentFormProps> = ({
  name,
  email,
  birthDate,
  onBack,
  isModal,
}) => {
  const [showConfirmationForm, setShowConfirmationForm] =
    React.useState<boolean>(false);

  const [registerUser, { isLoading, isError, error }] =
    useRegisterUserMutation();

  const [username, setUsername] = React.useState<string>("");
  const [emailFailedCode, setEmailFailedCode] = React.useState<string>("");

  const [
    sendEmailConfirmationCode,
    { isLoading: isLoadingSendingEmailConfirmationCode },
  ] = useSendEmailConfirmationCodeMutation();

  React.useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overscrollBehaviorY = "none";
    };
  }, []);

  // if not registered go back and show error message
  React.useEffect(() => {
    if (isError && error) {
      const apiError = extractApiError(error);
      console.log(error);
      if (apiError) {
        onBack(
          apiError.data.error,
          apiError.data.exception,
          name,
          email,
          birthDate
        );
      } else {
        console.log("message", "Registration failed. Please try again.");
        onBack(
          "Registration failed. Please try again.",
          null,
          name,
          email,
          birthDate
        );
      }
    }
  }, [isError, error, onBack, name, email, birthDate]);

  const handleRegister = async () => {
    try {
      // Register the user
      const userObject = await registerUser({
        name,
        email,
        birthDate,
      }).unwrap();
      console.log("USERNAME", userObject.username);

      setUsername(userObject.username);

      try {
        await sendEmailConfirmationCode({
          username: userObject.username,
        }).unwrap();
        //show form to confirm the code sent
        setShowConfirmationForm(true);
      } catch (emailErr) {
        // Check if it's an EmailFailedToSendException
        const apiError = extractApiError(emailErr);

        if (
          apiError &&
          apiError.data.exception === "EmailFailedToSendException"
        ) {
          setEmailFailedCode("123456");
          setShowConfirmationForm(true);
        } else {
          throw emailErr;
        }
      }
    } catch (err) {
      // Error handling is managed by useEffect, by going back
    }
  };

  const handleGoBack = () => {
    onBack("", null, name, email, birthDate);
  };

  if (showConfirmationForm) {
    return (
      <CodeConfirmationForm
        username={username}
        email={email}
        isModal={isModal}
        emailFailedCode={emailFailedCode}
      />
    );
  }
  return (
    <Modal
      isModal={isModal}
      onClose={handleGoBack}
      showCloseButton={false}
      showBackButton={true}
      contentClassName="px-8 md:px-20 pb-72 md:pb-20 overflow-y-auto"
      footerClassName="border-0 md:border-t border-borderColor md:shadow-glow dark:bg-black rounded-2xl px-12 md:px-20 pb-6 md:pb-12 md:pt-[43px]"
      footer={
        <Button
          variant="primary"
          size="large"
          onClick={handleRegister}
          disabled={isLoading || isLoadingSendingEmailConfirmationCode}
        >
          {isLoading || isLoadingSendingEmailConfirmationCode
            ? "Loading..."
            : "Next"}
        </Button>
      }
    >
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">
        Customize your experience
      </h1>
      <div className="my-4 leading-5">
        <h2 className="mb-2 text-xl font-bold">Get more out of X</h2>
        <div className="relative">
          <div className="absolute right-0 top-0">
            <Checkbox />
          </div>
          <div className="pr-10">
            <p>Receive email about your X activity and recommendations.</p>
          </div>
        </div>
      </div>
      <div className="my-4 leading-5">
        <h2 className="mb-2 text-xl font-bold">Connect with people you know</h2>
        <div className="relative">
          <div className="absolute right-0 top-0">
            <Checkbox />
          </div>
          <div className="pr-10">
            <p>Let others find your X account by your email address.</p>
          </div>
        </div>
      </div>

      <div className="my-4 leading-5">
        <h2 className="mb-2 text-xl font-bold">Personalized ads</h2>
        <div className="relative">
          <div className="absolute right-0 top-0">
            <Checkbox />
          </div>
          <div className="pr-10">
            <p>
              You will always see ads on X based on your X activity. When this
              setting is enabled, X may further personalize ads from X
              advertisers, on and off X, by combining your X activity with other
              online activity and information from our partners.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 leading-5 text-textMuted">
        By signing up, you agree to our{" "}
        <a href="#" className="text-primaryBlue">
          Terms
        </a>
        ,{" "}
        <a href="#" className="text-primaryBlue">
          Privacy Policy
        </a>
        , and{" "}
        <a href="#" className="text-primaryBlue">
          Cookie Use
        </a>
        . X may use your contact information, including your email address and
        phone number for purposes outlined in our Privacy Policy.{" "}
        <a href="#" className="text-primaryBlue">
          Learn more
        </a>
      </p>
    </Modal>
  );
};

export default SettingsConsentForm;
