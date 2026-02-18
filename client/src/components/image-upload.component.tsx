/**
 * @file image-upload.components.tsx
 * @brief
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useState, useRef } from "react";
import { ImagesService } from "@/services/images.service";

interface ImageUploadProps {
    onImageUploaded: (imageUrl: string) => void;
    currentImage: string;
}

export default function ImageUpload({
    onImageUploaded,
    currentImage,
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>(currentImage);
    const [error, setError] = useState("");

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            setError("");

            const response = await ImagesService.uploadImage(file);
            console.log("Upload response:", response);

            if (response.success && response.imageUrl) {
                onImageUploaded(response.imageUrl);
                setPreview(response.imageUrl);
            } else {
                throw new Error(
                    response.message || "An error occurred during upload.",
                );
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred during upload.",
            );
            setPreview(currentImage);
        }

        setUploading(false);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError("");

        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const validation = ImagesService.validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error || "Invalid file.");
            return;
        }

        handleUpload(file);
    };

    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const handleReset = () => {
        setPreview(currentImage);
        onImageUploaded(currentImage);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setError("");
    };

    return (
        <div className="image-upload">
            <div className="image-upload-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="image-upload-img" />
            </div>

            <div className="image-upload-controls">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    hidden
                />
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleChooseFile}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Choose Image"}
                </button>

                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}
