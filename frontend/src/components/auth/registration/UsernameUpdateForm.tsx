import Navigation from "@/hooks/Navigation";
import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/form/Button";
import Input from "@/components/form/Input";
import { useRouter } from "next/navigation";

// Mock username validation function
const validateUsername = (
  username: string
): { isValid: boolean; error?: string } => {
  if (!username.trim()) {
    return { isValid: false, error: "Username is required" };
  }
  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters" };
  }
  if (username.length > 15) {
    return { isValid: false, error: "Username must be 15 characters or less" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { isValid: true };
};

export const UsernameUpdateFormModal: React.FC = () => {
  const [username, setUsername] = useState("");
  const [validation, setValidation] = useState({ isValid: true, error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    const validationResult = validateUsername(value);
    setValidation({
      isValid: validationResult.isValid,
      error: validationResult.error || "",
    });
  };

  const handleContinueOrSkip = async () => {
    if (username.trim()) {
      const validationResult = validateUsername(username);
      if (!validationResult.isValid) {
        setValidation({
          isValid: validationResult.isValid,
          error: validationResult.error || "",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Mock API call - simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Username updated:", username);
        // Mock success - you can replace this with actual API call
        alert(`Username successfully updated to: ${username}`);
        // Navigate to next step or close modal
        router.push("/home");
      } catch (error) {
        console.error("Failed to update username:", error);
        alert("Failed to update username. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Skip username update
      router.push("/home");
    }
  };

  return (
    <div className="flex min-h-screen justify-center dark:bg-black">
      <div className="relative w-full max-w-screen-xl sm:flex">
        <Navigation />
        <div className="absolute inset-0 bg-black/40 transition-colors duration-300 dark:bg-black/50" />
        <main className="relative z-10 flex w-full items-center justify-center">
          <Modal
            isModal={true}
            onClose={() => {}}
            showCloseButton={false}
            contentClassName="px-8 "
            footer={
              <Button
                onClick={handleContinueOrSkip}
                variant="primary"
                size="large"
                disabled={isLoading}
              >
                {isLoading
                  ? "Updating..."
                  : username.trim()
                    ? "Continue"
                    : "Skip for now"}
              </Button>
            }
          >
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">
              Pick a username
            </h1>
            <p className="mb-6 text-textSecondary">
              Choose your unique username. You can always change it later.
            </p>
            <div className="flex flex-col items-center justify-center">
              <Input
                inputId="username"
                inputNamePlaceHolder="Username"
                value={username}
                onChange={handleUsernameChange}
                isInputTextValid={validation.isValid}
                inputTextInvalidText={validation.error}
                maxCharLength={15}
                showCharCount={true}
                isInputNumeric={false}
              />
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export const UsernameUpdateFormNonModal: React.FC = () => {
  const [username, setUsername] = useState("");
  const [validation, setValidation] = useState({ isValid: true, error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    const validationResult = validateUsername(value);
    setValidation({
      isValid: validationResult.isValid,
      error: validationResult.error || "",
    });
  };

  const handleContinueOrSkip = async () => {
    if (username.trim()) {
      const validationResult = validateUsername(username);
      if (!validationResult.isValid) {
        setValidation({
          isValid: validationResult.isValid,
          error: validationResult.error || "",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Mock API call - simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Username updated:", username);
        // Mock success - you can replace this with actual API call
        alert(`Username successfully updated to: ${username}`);
        // Navigate to next step
        router.push("/home");
      } catch (error) {
        console.error("Failed to update username:", error);
        alert("Failed to update username. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Skip username update
      router.push("/home");
    }
  };

  return (
    <div className="flex min-h-screen justify-center dark:bg-black">
      <div
        className={`absolute inset-0 z-20 ${"bg-white dark:bg-black/55"} transition-colors duration-300`}
      />
      <div className="relative z-30 w-full max-w-screen-xl sm:flex">
        <main className="relative z-10 mr-24 flex w-full items-center justify-center">
          <Modal
            isModal={false}
            onClose={() => {}}
            showCloseButton={false}
            contentClassName="px-8 overflow-y-auto"
            footer={
              <Button
                onClick={handleContinueOrSkip}
                variant="primary"
                size="large"
                disabled={isLoading}
              >
                {isLoading
                  ? "Updating..."
                  : username.trim()
                    ? "Continue"
                    : "Skip for now"}
              </Button>
            }
          >
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">
              Pick a username
            </h1>
            <p className="mb-6 text-textSecondary">
              Choose your unique username. You can always change it later.
            </p>
            <div className="flex flex-col items-center justify-center">
              <Input
                inputId="username"
                inputNamePlaceHolder="Username"
                value={username}
                onChange={handleUsernameChange}
                isInputTextValid={validation.isValid}
                inputTextInvalidText={validation.error}
                maxCharLength={15}
                showCharCount={true}
                isInputNumeric={false}
              />
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
