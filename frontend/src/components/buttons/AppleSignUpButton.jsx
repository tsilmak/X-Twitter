"use client";
import React, { useEffect, useState } from "react";

const AppleSignUpButton = () => {
  const [appleJSLoaded, setAppleJSLoaded] = useState(false);

  useEffect(() => {
    const loadAppleScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Initialize Apple Authentication
        window.AppleID.auth.init({
          clientId: "com.your.service", // Replace with  actual client ID
          scope: "name email", // Scopes  needed
          redirectURI: "https://your-redirect-url.com/auth/apple/callback", // Replace with your redirect URI
          state: generateRandomString(), // Generate a random state for security
          nonce: generateRandomString(), // Generate a random nonce for security
          usePopup: true, // Enable popup mode
        });

        setAppleJSLoaded(true);
      };

      document.body.appendChild(script);

      // Clean up
      return () => {
        const scriptElement = document.querySelector(
          'script[src*="appleid.cdn-apple.com"]'
        );
        if (scriptElement && document.body.contains(scriptElement)) {
          document.body.removeChild(scriptElement);
        }
      };
    };

    loadAppleScript();
  }, []);

  // Generate a random string for state and nonce
  const generateRandomString = () => {
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleAppleSignUp = () => {
    if (appleJSLoaded && window.AppleID) {
      window.AppleID.auth
        .signIn()
        .then((response) => {
          console.log("Apple Sign-In successful:", response);
          // Handle the authorization response
          // You'd typically send this to your backend for validation

          // The response contains:
          // - authorization.code: Auth code to send to your server
          // - authorization.id_token: JWT containing user info
          // - user: User information if requested (name, email)
        })
        .catch((error) => {
          console.error("Apple Sign-In error:", error);
        });
    } else {
      console.error("Apple JS API not loaded yet");
    }
  };

  return (
    <button
      onClick={handleAppleSignUp}
      className="flex w-[300px] items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-2 text-[15px] font-bold text-black transition-colors hover:bg-[#e6e6e6]"
      disabled={!appleJSLoaded}
    >
      {/* Apple Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 48 48"
        width="20px"
        height="20px"
        fill="black"
      >
        <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
      </svg>
      Sign up with Apple
    </button>
  );
};

export default AppleSignUpButton;
