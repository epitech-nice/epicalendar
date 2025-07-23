'use client'

import { useState, useRef } from 'react'
import { ImagesService } from '@/services/imagesService'



interface ImageUploadProps {
    onImageUploaded: (imageUrl: string) => void
    currentImage: string
}



export default function ImageUpload({ onImageUploaded, currentImage }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string>(currentImage)
    const [error, setError] = useState('')



    const handleUpload = async (file: File) => {
        try {
            setUploading(true)
            setError('')
            
            const response = await ImagesService.uploadImage(file)
            console.log('Upload response:', response)
            
            if (response.success && response.imageUrl) {
                onImageUploaded(response.imageUrl)
                setPreview(response.imageUrl)
            } else {
                throw new Error(response.message || 'An error occurred during upload.')
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during upload.')
            setPreview(currentImage)
        }

        setUploading(false)
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('')

        const file = event.target.files?.[0]
        if (!file) {
            return
        }

        const validation = ImagesService.validateImageFile(file)
        if (!validation.valid) {
            setError(validation.error || 'Invalid file.')
            return
        }

        handleUpload(file)
    }

    const handleChooseFile = () => {
        fileInputRef.current?.click()
    }

    const handleReset = () => {
        setPreview(currentImage);
        onImageUploaded(currentImage);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setError('');
    }



    return (
        <div>
            <div>
                { /* Je peux pas faire de balise Image next parce que sa pu et qu'il faut autoriser le lien dans le next config */ }
                { /* eslint-disable-next-line @next/next/no-img-element */ }
                <img
                    src={preview}
                    alt="Preview"
                />
            </div>

            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    hidden
                />
                <button
                    type="button"
                    onClick={handleChooseFile}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Choose image'}
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                >
                    Reset image
                </button>
            </div>

            {error && (
                <div>
                    {error}
                </div>
            )}
        </div>
    )
}
