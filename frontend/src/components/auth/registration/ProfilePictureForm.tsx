import Navigation from "@/hooks/Navigation";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Modal from "@/components/common/Modal";
import Button from "@/components/form/Button";
import ImagePositionEditor from "@/components/common/ImagePositionEditor";
import { TrashIcon, CameraIcon } from "@/utils/icons";
import {
  UsernameUpdateFormModal,
  UsernameUpdateFormNonModal,
} from "./UsernameUpdateForm";

interface ImagePosition {
  x: number;
  y: number;
  scale: number;
}

export const ProfilePictureFormModal: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPositioning, setIsPositioning] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (!isPositioning) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      setIsPositioning(true);
    }
  };

  const handleContinueOrSkip = () => {
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
    }
    setShowUsernameForm(true);
  };

  if (showUsernameForm) {
    return <UsernameUpdateFormModal />;
  }

  const handleApplyPosition = (imageUrl: string, position: ImagePosition) => {
    console.log(position);
    setSelectedImage(imageUrl);
    setIsPositioning(false);
    setTempImage(null);
  };

  const handleCancelPosition = () => {
    setIsPositioning(false);
    setTempImage(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
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
            contentClassName="px-8 overflow-y-auto"
            footer={
              <Button
                onClick={handleContinueOrSkip}
                variant="primary"
                size="large"
                disabled={false}
              >
                {selectedImage ? "Continue" : "Skip for now"}
              </Button>
            }
          >
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">
              Pick a profile picture
            </h1>
            <p className="leading-[0px] text-textSecondary">
              Have a favorite selfie? Upload it now.
            </p>
            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                className="hidden"
              />
              <div className="group relative my-24">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="Profile picture"
                    onClick={handleImageClick}
                    className="h-44 w-44 cursor-pointer rounded-full border-2 border-borderColor object-cover transition-opacity group-hover:opacity-80"
                  />
                ) : (
                  <Image
                    src="/Twitter_default_profile_400x400.png"
                    alt="Profile picture"
                    width={176}
                    height={176}
                    onClick={handleImageClick}
                    className="cursor-pointer rounded-full border-2 border-borderColor transition-opacity group-hover:opacity-80"
                  />
                )}
                <div
                  onClick={handleImageClick}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <div className="rounded-full bg-black/60 p-3">
                    <CameraIcon width="32" height="32" />
                  </div>
                </div>
              </div>
              {selectedImage && (
                <div className="-mt-16 mb-12">
                  <Button
                    onClick={handleRemoveImage}
                    variant="destructive"
                    size="small"
                    fullWidth={false}
                    className="flex items-center gap-2 px-6"
                  >
                    <TrashIcon width="16" height="16" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </Modal>
        </main>
      </div>

      {/* Image Positioning Editor */}
      {isPositioning && tempImage && (
        <ImagePositionEditor
          imageUrl={tempImage}
          onApply={handleApplyPosition}
          onCancel={handleCancelPosition}
        />
      )}
    </div>
  );
};

export const ProfilePictureFormNonModal: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPositioning, setIsPositioning] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (!isPositioning) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      setIsPositioning(true);
    }
  };

  const handleContinueOrSkip = () => {
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
    }
    setShowUsernameForm(true);
  };

  if (showUsernameForm) {
    return <UsernameUpdateFormNonModal />;
  }

  const handleApplyPosition = (imageUrl: string, position: ImagePosition) => {
    console.log(position);
    setSelectedImage(imageUrl);
    setIsPositioning(false);
    setTempImage(null);
  };

  const handleCancelPosition = () => {
    setIsPositioning(false);
    setTempImage(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
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
                disabled={false}
              >
                {selectedImage ? "Continue" : "Skip for now"}
              </Button>
            }
          >
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">
              Pick a profile picture
            </h1>
            <p className="leading-[0px] text-textSecondary">
              Have a favorite selfie? Upload it now.
            </p>
            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                className="hidden"
              />
              <div className="group relative my-24">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="Profile picture"
                    onClick={handleImageClick}
                    className="h-44 w-44 cursor-pointer rounded-full border-2 border-borderColor object-cover transition-opacity group-hover:opacity-80"
                  />
                ) : (
                  <Image
                    src="/Twitter_default_profile_400x400.png"
                    alt="Profile picture"
                    width={176}
                    height={176}
                    onClick={handleImageClick}
                    className="cursor-pointer rounded-full border-2 border-borderColor transition-opacity group-hover:opacity-80"
                  />
                )}
                <div
                  onClick={handleImageClick}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <div className="rounded-full bg-black/60 p-3">
                    <CameraIcon width="32" height="32" />
                  </div>
                </div>
              </div>
              {selectedImage && (
                <div className="-mt-16 mb-12">
                  <Button
                    onClick={handleRemoveImage}
                    variant="destructive"
                    size="small"
                    fullWidth={false}
                    className="flex items-center gap-2 px-6"
                  >
                    <TrashIcon width="16" height="16" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </Modal>
        </main>
      </div>

      {/* Image Positioning Editor */}
      {isPositioning && tempImage && (
        <ImagePositionEditor
          imageUrl={tempImage}
          onApply={handleApplyPosition}
          onCancel={handleCancelPosition}
        />
      )}
    </div>
  );
};
