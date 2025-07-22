import api from "./api";
import axios from "axios";



export interface UploadResponse {
    success: boolean;
    message: string;
    imageUrl?: string;
    filename?: string;
    originalName?: string;
    size?: number;
}



export const ImagesService = {
    async uploadImage(file: File): Promise<UploadResponse> {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = response.data;

            if (data.success && data.filename) {
                data.imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/image/${data.filename}`;
            }
            return data;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "An error occurred while uploading the image";
                throw new Error(message);
            } else {
                throw new Error("An error occurred while uploading the image");
            }
        }
    },


    validateImageFile(file: File): { valid: boolean; error?: string } {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Invalid file type. Allowed types: jpeg, jpg, png, gif, webp.'
            };
        }

        return { valid: true };
    }
};
