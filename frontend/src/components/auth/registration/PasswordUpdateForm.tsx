"use client";

import React from "react";
import Input from "../../form/Input";
import { useUpdatePasswordMutation } from "@/app/lib/api/authApi";
import {
  ProfilePictureFormModal,
  ProfilePictureFormNonModal,
} from "./ProfilePictureForm";
import { setUser } from "@/app/lib/features/user/userSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import Button from "@/components/form/Button";
import Modal from "@/components/common/Modal";
import { UpdateUserInfoForm } from "@/@types";

const PasswordUpdateForm = ({ isModal, username }: UpdateUserInfoForm) => {
  const dispatch = useAppDispatch();

  const [updatePassword, { isLoading, isError, error }] =
    useUpdatePasswordMutation();

  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isInputError, setIsInputError] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>("");

  const [showProfilePictureUpdateForm, setShowProfilePictureUpdateForm] =
    React.useState<boolean>(false);

  const handleUpdateUserPassword = async () => {
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      setIsInputError(true);
      return;
    }

    try {
      await updatePassword({ password, username }).unwrap();
      dispatch(setUser({ username: username, profilePictureSrc: "" }));
      setShowProfilePictureUpdateForm(true);
    } catch (err) {
      console.error("Confirmation failed:", err);
      setErrorMessage(
        isError && error && "data" in error && typeof error.data === "string"
          ? error.data
          : "Password update failed. Please try again."
      );
      setIsInputError(true);
    }
  };

  if (showProfilePictureUpdateForm) {
    if (isModal)
      return <ProfilePictureFormModal username={username} isModal={isModal} />;
    if (!isModal)
      return (
        <ProfilePictureFormNonModal username={username} isModal={isModal} />
      );
  }
  return (
    <Modal
      isModal={isModal}
      onClose={() => {}}
      showCloseButton={false}
      contentClassName="px-8 md:px-20 pb-96 md:pb-64"
      footer={
        <Button
          onClick={handleUpdateUserPassword}
          variant="primary"
          size="large"
          disabled={
            !password ||
            isLoading ||
            password.length > 128 ||
            password.length < 8
          }
        >
          {isLoading ? "Loading..." : "Confirm"}
        </Button>
      }
    >
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          You will need a password
        </h1>
        <p className="mb-6 mt-2 dark:text-neutral-500">
          Must be 8 characters or more.
        </p>
      </div>
      <Input
        inputId="password"
        inputNamePlaceHolder="Password"
        maxCharLength={128}
        onChange={(value) => {
          setPassword(value);
          if (value.length > 128) {
            setErrorMessage("Password must be less than 128 characters.");
            setIsInputError(true);
          } else if (isInputError && value.length >= 8) {
            setIsInputError(false);
          }
        }}
        isInputTextValid={password.length <= 128}
        inputTextInvalidText={errorMessage}
        isInputNumeric={false}
      />
    </Modal>
  );
};
export default PasswordUpdateForm;
