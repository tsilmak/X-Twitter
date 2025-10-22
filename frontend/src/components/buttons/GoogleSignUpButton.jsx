"use client";
import React, { useEffect, useState } from "react";

const GoogleSignUpButton = () => {
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const CLIENT_ID = "123"; // Replace with actual client ID
  const REDIRECT_URI = "123"; // Replace with actual redirect URI

  useEffect(() => {
    // Load the Google API Client Library
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api:client.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initGoogleAuth();
    };

    document.body.appendChild(script);

    // Clean up
    return () => {
      const scriptElement = document.querySelector(
        'script[src*="apis.google.com/js/api:client.js"]'
      );
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  const initGoogleAuth = () => {
    window.gapi.load("auth2", () => {
      const auth2 = window.gapi.auth2.init({
        client_id: CLIENT_ID,
        cookiepolicy: "single_host_origin",
        scope: "profile email",
        ux_mode: "popup",
      });

      setGoogleApiLoaded(true);
    });
  };

  const handleGoogleSignUp = () => {
    if (googleApiLoaded && window.gapi?.auth2) {
      const auth2 = window.gapi.auth2.getAuthInstance();

      auth2
        .signIn({
          ux_mode: "popup",
        })
        .then(
          (googleUser) => {
            // Get user information
            const profile = googleUser.getBasicProfile();
            const id_token = googleUser.getAuthResponse().id_token;

            console.log("ID Token:", id_token);
            console.log("User ID:", profile.getId());
            console.log("Name:", profile.getName());
            console.log("Email:", profile.getEmail());

            // Send the token to your backend for verification and user creation
            // sendTokenToBackend(id_token);
          },
          (error) => {
            console.error("Google Sign-In Error:", error);
          }
        );
    } else {
      console.error("Google API not loaded yet");
    }
  };

  return (
    <button
      onClick={handleGoogleSignUp}
      className="flex w-[300px] items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-2 text-[15px] font-bold text-black transition-colors hover:bg-[#e6e6e6]"
      disabled={!googleApiLoaded}
    >
      {/* Google Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="20px"
        height="20px"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
      Sign up with Google
    </button>
  );
};

export default GoogleSignUpButton;
