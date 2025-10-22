"use client";
import { useRouter } from "next/navigation";
import React from "react";

const OrganizationsSubscription = () => {
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
    <div className="fixed inset-0 z-40 flex h-full w-full items-center justify-center bg-black">
      <div className="text-xl text-white">Organizations</div>
      <button
        onClick={handleClose}
        className="absolute left-4 top-4 text-white"
        aria-label="Close modal"
      >
        X
      </button>
    </div>
  );
};

export default OrganizationsSubscription;
