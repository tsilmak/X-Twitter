import React, { useRef, useState } from "react";
import Image from "next/image";
import Button from "../form/Button";

interface ImagePosition {
  x: number;
  y: number;
  scale: number;
}

interface ImagePositionEditorProps {
  imageUrl: string;
  onApply: (imageUrl: string, position: ImagePosition) => void;
  onCancel: () => void;
}

const ImagePositionEditor: React.FC<ImagePositionEditorProps> = ({
  imageUrl,
  onApply,
  onCancel,
}) => {
  const [imagePosition, setImagePosition] = useState<ImagePosition>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [minScale, setMinScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
    setImageDimensions(dimensions);

    // Calculate minimum scale to fill container
    if (containerRef.current) {
      const containerSize = containerRef.current.offsetWidth;
      const calculatedMinScale = Math.max(
        containerSize / dimensions.width,
        containerSize / dimensions.height
      );

      setMinScale(calculatedMinScale);

      // Set initial scale to fill container completely
      setImagePosition((prev) => ({
        ...prev,
        scale: calculatedMinScale,
      }));
    }
  };

  const getBounds = (scale?: number) => {
    if (!containerRef.current || !imageDimensions.width) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    const currentScale = scale ?? imagePosition.scale;
    const containerSize = containerRef.current.offsetWidth;
    const scaledWidth = imageDimensions.width * currentScale;
    const scaledHeight = imageDimensions.height * currentScale;

    // Calculate bounds to prevent showing white space
    const maxX = Math.max(0, (scaledWidth - containerSize) / 2);
    const minX = -maxX;
    const maxY = Math.max(0, (scaledHeight - containerSize) / 2);
    const minY = -maxY;

    return { minX, maxX, minY, maxY };
  };

  const constrainPosition = (x: number, y: number, scale?: number) => {
    const bounds = getBounds(scale);
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newPos = constrainPosition(
      e.clientX - dragStart.x,
      e.clientY - dragStart.y
    );
    setImagePosition((prev) => ({
      ...prev,
      ...newPos,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - imagePosition.x,
      y: touch.clientY - imagePosition.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newPos = constrainPosition(
      touch.clientX - dragStart.x,
      touch.clientY - dragStart.y
    );
    setImagePosition((prev) => ({
      ...prev,
      ...newPos,
    }));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setImagePosition((prev) => {
      const maxScale = minScale * 3;
      const newScale = Math.max(
        minScale,
        Math.min(maxScale, prev.scale + delta)
      );
      // Adjust position to stay within bounds when zooming
      const constrained = constrainPosition(prev.x, prev.y, newScale);
      return {
        ...constrained,
        scale: newScale,
      };
    });
  };

  const handleApply = () => {
    onApply(imageUrl, imagePosition);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
      {/* Modal Container */}
      <div className="mx-4 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderColor px-4 py-2">
          <button
            onClick={onCancel}
            className="rounded-full p-2 text-white transition hover:bg-white/10"
            aria-label="Go back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-white">Edit media</h1>
          <Button
            onClick={handleApply}
            variant="primary"
            size="small"
            fullWidth={false}
            className="px-4"
          >
            Apply
          </Button>
        </div>

        {/* Main Image Area */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black p-6">
          {/* Background image (dimmed) */}
          <div className="absolute inset-0 overflow-hidden opacity-40">
            <Image
              src={imageUrl}
              alt="Background"
              className="absolute left-1/2 top-1/2 max-w-none"
              style={{
                transform: `translate(-50%, -50%) translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imagePosition.scale})`,
              }}
              draggable={false}
            />
          </div>
          <div className="relative z-10 aspect-square w-full max-w-md">
            <div
              ref={containerRef}
              className="absolute inset-0 overflow-hidden border-4 border-[#1d9bf0]"
            >
              <div
                className="absolute inset-0 cursor-move select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  ref={imageRef}
                  src={imageUrl}
                  alt="Position your image"
                  onLoad={handleImageLoad}
                  className="absolute left-1/2 top-1/2 max-w-none"
                  style={{
                    transform: `translate(-50%, -50%) translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imagePosition.scale})`,
                  }}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-4 px-6 pb-6">
          <button
            onClick={() => handleZoom(-minScale * 0.1)}
            className="rounded-full p-2 text-white transition hover:bg-white/10"
            aria-label="Zoom out"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
          </button>

          {/* Zoom slider */}
          <input
            type="range"
            min={minScale}
            max={minScale * 3}
            step="0.01"
            value={imagePosition.scale}
            onChange={(e) => {
              const newScale = parseFloat(e.target.value);
              const constrained = constrainPosition(
                imagePosition.x,
                imagePosition.y,
                newScale
              );
              setImagePosition(() => ({
                ...constrained,
                scale: newScale,
              }));
            }}
            className="slider h-1 max-w-xs flex-1 cursor-pointer appearance-none rounded-lg bg-gray-600"
            style={{
              background: `linear-gradient(to right, #1d9bf0 0%, #1d9bf0 ${
                ((imagePosition.scale - minScale) / (minScale * 2)) * 100
              }%, #4b5563 ${
                ((imagePosition.scale - minScale) / (minScale * 2)) * 100
              }%, #4b5563 100%)`,
            }}
          />

          <button
            onClick={() => handleZoom(minScale * 0.1)}
            className="rounded-full p-2 text-white transition hover:bg-white/10"
            aria-label="Zoom in"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePositionEditor;
