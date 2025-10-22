import { XLogo } from "@/utils/icons";
import React from "react";

const LoadingOverlayXLogo = () => {
  return (
    <div className="fixed inset-0 z-40 flex h-full w-full items-center justify-center bg-black">
      <div>
        <XLogo width={"140"} height={"140"} fill={"white"} />
      </div>
    </div>
  );
};

export default LoadingOverlayXLogo;
