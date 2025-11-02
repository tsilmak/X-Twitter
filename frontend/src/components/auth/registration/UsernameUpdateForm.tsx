import Navigation from "@/hooks/Navigation";
import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/form/Button";
import Input from "@/components/form/Input";
import { useRouter } from "next/navigation";
import { useLazyCheckUsernameQuery } from "@/app/lib/api/usernameApi";
import { UpdateUserInfoForm } from "@/@types";
import { validateUsername } from "@/utils/lib";

export const UsernameUpdateFormModal: React.FC<UpdateUserInfoForm> = ({
  isModal,
  username,
}) => {
  // Initialize with current username only once - use lazy initializer
  const [futureUsername, setFutureUsername] = useState<string>(
    () => username || ""
  );
  const [validation, setValidation] = useState({ isValid: true, error: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCookieTestLoading, setIsCookieTestLoading] =
    useState<boolean>(false);
  const router = useRouter();
  const [checkUsername, { isLoading: isChecking }] =
    useLazyCheckUsernameQuery();

  const handleCookieTest = async () => {
    setIsCookieTestLoading(true);
    try {
      // Log all available cookies
      const allCookies = document.cookie;
      console.log("Available cookies:", allCookies);

      // Parse cookies into an object
      const cookies: Record<string, string> = {};
      if (allCookies) {
        allCookies.split(";").forEach((cookie) => {
          const [name, value] = cookie.trim().split("=");
          if (name && value) {
            cookies[name] = decodeURIComponent(value);
          }
        });
      }
      console.log("Parsed cookies:", cookies);

      // Call Next.js API route which will proxy to Rust backend with cookies
      const cookieTestResponse = await fetch("/api/cookie-test", {
        method: "GET",
        credentials: "include", // This will send cookies to Next.js API route
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await cookieTestResponse.json();
      console.log("Cookie test response:", responseData);
      console.log("Cookies sent:", allCookies || "No cookies found");

      alert(
        `Response: ${JSON.stringify(responseData, null, 2)}\n\n` +
          `Available cookies: ${allCookies || "None"}\n\n` +
          `Check console for details.`
      );
    } catch (cookieError) {
      console.error("Cookie test failed:", cookieError);
      console.log("Available cookies:", document.cookie || "None");
      alert(
        `Cookie test failed. Check console for details.\n\n` +
          `Available cookies: ${document.cookie || "None"}`
      );
    } finally {
      setIsCookieTestLoading(false);
    }
  };

  useEffect(() => {
    // Skip API call for empty or invalid usernames
    const validationResult = validateUsername(futureUsername);
    if (!futureUsername.trim() || !validationResult.isValid) {
      setValidation({
        isValid: validationResult.isValid,
        error: validationResult.error || "",
      });
      return;
    }

    // If the future username is the same as current username, it's valid (no API call needed)
    if (futureUsername === username) {
      setValidation({ isValid: true, error: "" });
      return;
    }

    // Call API immediately on every keystroke for different usernames
    checkUsername(futureUsername)
      .unwrap()
      .then((result) => {
        if (result.available) {
          setValidation({ isValid: true, error: "" });
        } else {
          setValidation({
            isValid: false,
            error: result.message || "Username is already taken",
          });
        }
      })
      .catch((error: any) => {
        // Handle API errors
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to check username. Please try again.";
        setValidation({
          isValid: false,
          error: errorMessage,
        });
      });
  }, [futureUsername, username, checkUsername]);

  const handleUsernameChange = (value: string) => {
    setFutureUsername(value);
  };

  const handleContinueOrSkip = async () => {
    if (futureUsername.trim()) {
      // Wait for any pending username check to complete
      if (isChecking) {
        return;
      }

      const validationResult = validateUsername(futureUsername);
      if (!validationResult.isValid || !validation.isValid) {
        setValidation({
          isValid: false,
          error:
            validationResult.error || validation.error || "Username is invalid",
        });
        return;
      }

      // If username hasn't changed, no need to check availability
      if (futureUsername === username) {
        console.log("Username unchanged:", futureUsername);
        // TODO: Replace with actual API call to update username if needed
        router.push("/home");
        return;
      }

      // Double-check username availability before proceeding for new usernames
      setIsLoading(true);
      try {
        const result = await checkUsername(futureUsername).unwrap();
        if (!result.available) {
          setValidation({
            isValid: false,
            error: result.message || "Username is already taken",
          });
          setIsLoading(false);
          return;
        }

        console.log("Username updated:", futureUsername);
        // TODO: Replace with actual API call to update username
        // Navigate to next step or close modal
        router.push("/home");
      } catch (error: any) {
        console.error("Failed to check username:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to verify username. Please try again.";
        setValidation({
          isValid: false,
          error: errorMessage,
        });
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
                disabled={isLoading || isChecking}
              >
                {isLoading || isChecking
                  ? "Checking..."
                  : futureUsername.trim()
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
            <div className="relative mb-8 w-full">
              <Input
                inputId="username"
                inputNamePlaceHolder="Username"
                value={futureUsername}
                onChange={handleUsernameChange}
                isInputTextValid={validation.isValid}
                inputTextInvalidText={validation.error}
                maxCharLength={15}
                showCharCount={true}
                isInputNumeric={false}
              />
            </div>
            <div className="mt-4">
              <Button
                onClick={handleCookieTest}
                variant="secondary"
                size="small"
                disabled={isCookieTestLoading}
              >
                {isCookieTestLoading ? "Testing..." : "Test Cookie"}
              </Button>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export const UsernameUpdateFormNonModal: React.FC<UpdateUserInfoForm> = ({
  isModal,
  username,
}) => {
  // Initialize with current username only once - use lazy initializer
  const [futureUsername, setFutureUsername] = useState<string>(
    () => username || ""
  );
  const [validation, setValidation] = useState({ isValid: true, error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isCookieTestLoading, setIsCookieTestLoading] =
    useState<boolean>(false);
  const router = useRouter();
  const [checkUsername, { isLoading: isChecking }] =
    useLazyCheckUsernameQuery();

  const handleCookieTest = async () => {
    setIsCookieTestLoading(true);
    try {
      // Log all available cookies
      const allCookies = document.cookie;
      console.log("Available cookies:", allCookies);

      // Parse cookies into an object
      const cookies: Record<string, string> = {};
      if (allCookies) {
        allCookies.split(";").forEach((cookie) => {
          const [name, value] = cookie.trim().split("=");
          if (name && value) {
            cookies[name] = decodeURIComponent(value);
          }
        });
      }
      console.log("Parsed cookies:", cookies);

      // Call Next.js API route which will proxy to Rust backend with cookies
      const cookieTestResponse = await fetch("/api/debug-cookies", {
        method: "GET",
        credentials: "include", // This will send cookies to Next.js API route
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await cookieTestResponse.json();
      console.log("Cookie test response:", responseData);
      console.log("Cookies sent:", allCookies || "No cookies found");

      alert(
        `Response: ${JSON.stringify(responseData, null, 2)}\n\n` +
          `Available cookies: ${allCookies || "None"}\n\n` +
          `Check console for details.`
      );
    } catch (cookieError) {
      console.error("Cookie test failed:", cookieError);
      console.log("Available cookies:", document.cookie || "None");
      alert(
        `Cookie test failed. Check console for details.\n\n` +
          `Available cookies: ${document.cookie || "None"}`
      );
    } finally {
      setIsCookieTestLoading(false);
    }
  };

  useEffect(() => {
    // Skip API call for empty or invalid usernames
    const validationResult = validateUsername(futureUsername);
    if (!futureUsername.trim() || !validationResult.isValid) {
      setValidation({
        isValid: validationResult.isValid,
        error: validationResult.error || "",
      });
      return;
    }

    // If the future username is the same as current username, it's valid (no API call needed)
    if (futureUsername === username) {
      setValidation({ isValid: true, error: "" });
      return;
    }

    // Call API immediately on every keystroke for different usernames
    checkUsername(futureUsername)
      .unwrap()
      .then((result) => {
        if (result.available) {
          setValidation({ isValid: true, error: "" });
        } else {
          setValidation({
            isValid: false,
            error: result.message || "Username is already taken",
          });
        }
      })
      .catch((error: any) => {
        // Handle API errors
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to check username. Please try again.";
        setValidation({
          isValid: false,
          error: errorMessage,
        });
      });
  }, [futureUsername, username, checkUsername]);

  const handleUsernameChange = (value: string) => {
    setFutureUsername(value);
  };

  const handleContinueOrSkip = async () => {
    if (futureUsername.trim()) {
      // Wait for any pending username check to complete
      if (isChecking) {
        return;
      }

      const validationResult = validateUsername(futureUsername);
      if (!validationResult.isValid || !validation.isValid) {
        setValidation({
          isValid: false,
          error:
            validationResult.error || validation.error || "Username is invalid",
        });
        return;
      }

      // If username hasn't changed, no need to check availability
      if (futureUsername === username) {
        console.log("Username unchanged:", futureUsername);

        return;
      }

      // Double-check username availability before proceeding for new usernames
      setIsLoading(true);
      try {
        const result = await checkUsername(futureUsername).unwrap();
        if (!result.available) {
          setValidation({
            isValid: false,
            error: result.message || "Username is already taken",
          });
          setIsLoading(false);
          return;
        }

        console.log("Username updated:", futureUsername);
        // TODO: Replace with actual API call to update username
        // Navigate to next step
        router.push("/home");
      } catch (error: any) {
        console.error("Failed to check username:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to verify username. Please try again.";
        setValidation({
          isValid: false,
          error: errorMessage,
        });
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
                disabled={isLoading || isChecking}
              >
                {isLoading || isChecking
                  ? "Checking..."
                  : futureUsername.trim()
                    ? "Continue"
                    : "Skip for now"}
              </Button>
            }
          >
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">
              Pick a username
            </h1>
            <p className="mb-6 text-textSecondary">
              Choose your unique username. You can always change it later.
            </p>
            <div className="relative mb-8 w-full">
              <Input
                inputId="username"
                inputNamePlaceHolder="Username"
                value={futureUsername}
                onChange={handleUsernameChange}
                isInputTextValid={validation.isValid}
                inputTextInvalidText={validation.error}
                maxCharLength={15}
                showCharCount={true}
                isInputNumeric={false}
              />
            </div>
            <div className="mt-4">
              <Button
                onClick={handleCookieTest}
                variant="secondary"
                size="small"
                disabled={isCookieTestLoading}
              >
                {isCookieTestLoading ? "Testing..." : "Test Cookie"}
              </Button>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
