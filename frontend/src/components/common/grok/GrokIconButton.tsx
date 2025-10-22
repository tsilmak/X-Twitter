"use client";
import { CollapseIcon, GrokIcon, OpenConversationIcon } from "@/utils/icons";
import { usePathname } from "next/navigation";
import React from "react";

const GrokIconButton = () => {
  // Mini Grok Chat
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [characterCount, setCharacterCount] = React.useState<number>(0);
  const [typedText, setTypedText] = React.useState<string>("");
  const [isOpenMiniGrokChat, setIsOpenMiniGrokChat] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleInput = () => {
      console.log("Textarea value:", textarea.value);
      textarea.style.height = "auto";
      console.log("Scroll height:", textarea.scrollHeight);
      const newHeight = Math.min(textarea.scrollHeight, 355);
      console.log("New height:", newHeight);
      textarea.style.height = `${newHeight}px`;
      setCharacterCount(textarea.value.length);
    };

    handleInput(); // Initialize height and character count
    textarea.addEventListener("input", handleInput);

    return () => textarea.removeEventListener("input", handleInput);
  }, [typedText]);

  React.useEffect(() => {
    if (isOpenMiniGrokChat) {
      const text = "How can I help you today?";
      let index = 0;

      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setTypedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 18);

      return () => clearInterval(typingInterval);
    } else {
      setTypedText(""); // Reset typed text when chat is closed
    }
  }, [isOpenMiniGrokChat]);

  // Current component
  const pathname = usePathname();
  const excludedRoutes = ["/messages", "/i/grok", "/jobs"];
  const [isMessagesButtonVisible, setIsMessagesButtonVisible] =
    React.useState(false);

  // Check if MessagesButton exists in the DOM
  React.useEffect(() => {
    const checkMessagesButton = () => {
      const messagesButton = document.querySelector(".messages-button");
      setIsMessagesButtonVisible(!!messagesButton);
    };

    // Run on mount and whenever pathname changes
    checkMessagesButton();

    const observer = new MutationObserver(checkMessagesButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, [pathname]);

  const position = isMessagesButtonVisible
    ? "right-5 bottom-16"
    : "right-5 bottom-3";

  // Donesn'tt render GrokIconButton on excluded routes
  if (excludedRoutes.includes(pathname)) return null;

  return (
    <>
      {isOpenMiniGrokChat ? (
        <div
          className={`hidden w-[400px] rounded-2xl shadow-glow ${
            characterCount >= 534 ? "h-[645px]" : "h-[445px]"
          } fixed bottom-16 right-5 bg-white transition-all duration-300 ease-in-out lg:block dark:bg-black`}
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <GrokIcon
                width="25"
                height="25"
                fill="fill-black dark:fill-white"
              />
              <h1 className="ml-2 text-xl font-bold text-black dark:text-[#e7e9ea]">
                Grok
              </h1>
            </div>
            <div className="mr-2 flex">
              <button className="rounded-full p-2 hover:bg-[#e7e7e8] dark:hover:bg-[#181919]">
                <OpenConversationIcon
                  width="20"
                  height="20"
                  fill="fill-black dark:fill-white"
                />
              </button>

              <button
                onClick={() => setIsOpenMiniGrokChat(false)}
                className="rounded-full p-2 hover:bg-[#e7e7e8] dark:hover:bg-[#181919]"
              >
                <CollapseIcon
                  width="20"
                  height="20"
                  fill="fill-black dark:fill-white"
                />
              </button>
            </div>
          </div>
          <div className="px-2">
            <h1 className="my-6 flex items-center justify-center text-2xl font-bold text-primaryText">
              {typedText}
            </h1>
            <div className="w-full rounded-3xl bg-[#f7f9f9] transition-all duration-200 ease-in-out focus-within:bg-[#f7f9f9] focus-within:shadow-glow dark:bg-[#202327] dark:focus-within:bg-[#2a2d30]">
              <textarea
                ref={textareaRef}
                placeholder="Ask anything"
                className="box-border w-full resize-none rounded-3xl bg-inherit p-3.5 text-sm placeholder-[#757575] outline-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <button
          className={`hidden h-[53px] w-[55px] lg:block ${position} fixed rounded-2xl bg-white shadow-glow transition-all duration-300 ease-in-out hover:bg-[#e8f5fd] dark:bg-black dark:shadow-glow dark:hover:bg-[#031018]`}
          onClick={() => setIsOpenMiniGrokChat(true)}
        >
          <div className="flex items-center justify-center">
            <GrokIcon
              width={"32"}
              height={"32"}
              fill="fill-black dark:fill-white"
            />
          </div>
        </button>
      )}
    </>
  );
};

export default GrokIconButton;
