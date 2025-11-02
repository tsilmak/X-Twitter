import React, { useState } from "react";

interface InputProps {
  inputId: string;
  inputNamePlaceHolder: string;
  showCharCount?: boolean;
  maxCharLength: number;
  onChange: (value: string) => void;
  isInputTextValid: boolean;
  inputTextInvalidText?: string;
  isInputNumeric: boolean;
  value?: string;
}

const Input = ({
  inputId,
  inputNamePlaceHolder,
  showCharCount,
  maxCharLength,
  onChange,
  isInputTextValid,
  inputTextInvalidText,
  isInputNumeric,
  value,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Calculate charCount directly from value prop
  const charCount = value?.length || 0;

  return (
    <div className="relative">
      <input
        type={isInputNumeric ? "number" : "text"}
        id={inputId}
        className={`w-full border bg-transparent ${
          isInputTextValid
            ? "border-borderColor focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]"
            : "border-1 border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        } peer rounded p-2 pb-1 pt-6 focus:outline-none`}
        required
        value={value}
        maxLength={maxCharLength}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {showCharCount && isFocused && (
        <span className="absolute right-3 top-1 text-sm text-gray-500">
          {charCount} / {maxCharLength}
        </span>
      )}
      <label
        htmlFor={inputId}
        className={`${
          isInputTextValid
            ? "absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-200 ease-in-out peer-valid:top-4 peer-valid:text-xs peer-valid:text-[#65686d] peer-focus:top-4 peer-focus:text-xs peer-focus:text-[#1d9bf0]"
            : "absolute left-2 top-7 -translate-y-1/2 text-red-600 duration-200 ease-in-out peer-valid:top-4 peer-valid:text-xs peer-valid:text-red-600 peer-focus:top-4 peer-focus:text-xs peer-focus:text-red-600"
        } `}
      >
        {inputNamePlaceHolder}
      </label>
      {!isInputTextValid && inputTextInvalidText && (
        <span className="mt-1 text-sm text-red-700">
          {inputTextInvalidText}
        </span>
      )}
    </div>
  );
};

export default Input;
