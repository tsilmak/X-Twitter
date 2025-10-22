import React, { useRef, useEffect } from "react";
import { CloseIcon, GoBackIcon, XLogo } from "@/utils/icons";

interface ModalProps {
  isModal: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  showBackButton?: boolean;
  contentClassName?: string;
  footerClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isModal,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  showBackButton = false,
  contentClassName = "px-8 md:px-20",
  footerClassName = "px-12 md:pb-12",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Store the previously focused element when modal opens
  useEffect(() => {
    if (isModal) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus the first focusable element in the modal
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    } else {
      // Restore focus to the previously focused element when modal closes
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isModal]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab: moving backwards
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50" onKeyDown={handleKeyDown}>
      {/* Mask div to prevent background interaction */}
      <div
        ref={maskRef}
        className={`absolute inset-0 ${
          isModal
            ? "bg-black/50 dark:bg-slate-600/40"
            : "bg-white dark:bg-black"
        } transition-colors duration-300`}
        data-testid="mask"
        aria-hidden="true"
      />

      <div className="flex h-full items-start justify-center md:items-center">
        <div
          ref={modalRef}
          tabIndex={-1} // Add tabIndex="-1" to make the modal container non-focusable
          className="relative z-10 flex min-h-full w-full flex-col border-borderColor bg-white md:mx-4 md:max-h-[90vh] md:min-h-[650px] md:w-[600px] md:max-w-2xl md:rounded-2xl md:border dark:bg-black"
          aria-labelledby="modal-header"
          aria-modal="true"
          role="dialog"
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute left-2 top-2 rounded-full p-2 hover:bg-hoverOverlay dark:hover:bg-gray-800/50"
            >
              <CloseIcon
                width="20"
                height="20"
                fill="fill-black dark:fill-white"
              />
            </button>
          )}
          {showBackButton && (
            <button
              onClick={onClose}
              className="absolute left-2 top-2 rounded-full p-2 hover:bg-hoverOverlay dark:hover:bg-gray-800/50"
            >
              <GoBackIcon
                width="20"
                height="20"
                fill="fill-black dark:fill-white"
              />
            </button>
          )}
          <div className="mt-4 flex justify-center">
            <XLogo width="32" height="32" fill="fill-black dark:fill-white" />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="mt-6 px-8 md:px-20">
              {title && (
                <h1
                  id="modal-header"
                  className="mb-6 text-2xl font-bold md:text-3xl"
                >
                  {title}
                </h1>
              )}
              {description && (
                <p id="modal-description" className="mb-6 text-textSecondary">
                  {description}
                </p>
              )}
            </div>

            <div className={`flex-1 ${contentClassName}`}>{children}</div>
          </div>

          {footer && (
            <div className={`mt-auto ${footerClassName}`}>{footer}</div>
          )}

          {/* Focus trap div */}
          <div tabIndex={0} className="pointer-events-none absolute inset-0" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
