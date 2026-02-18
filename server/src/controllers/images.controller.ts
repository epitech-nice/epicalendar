import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import path from "path";
import fs from "fs";

/**
 * ImagesController - Handles image upload and retrieval operations
 * Manages image files in the uploads directory
 */
export class ImagesController {
    /**
     * Get list of all uploaded images
     * @param request - Express request object
     * @param response - Express response object
     */
    static getImages(request: Request, response: Response): void {
        try {
            const uploadsPath = path.join(__dirname, "../../../uploads");

            // Check if uploads directory exists
            if (!fs.existsSync(uploadsPath)) {
                response.json({
                    success: true,
                    images: [],
                });
                return;
            }

            // Read and filter image files
            const files = fs
                .readdirSync(uploadsPath)
                .filter((file) => {
                    const ext = path.extname(file).toLowerCase();
                    return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(
                        ext,
                    );
                })
                .map((file) => ({
                    filename: file,
                    url: `/api/image/${file}`,
                    fullUrl: `${request.protocol}://${request.get("host")}/api/image/${file}`,
                }));

            response.json({
                success: true,
                images: files,
                total: files.length,
            });
        } catch (error) {
            console.error("Error fetching images:", error);
            response
                .status(500)
                .json({ message: "Server error.", details: error });
        }
    }

    /**
     * Get a specific image by filename
     * @param request - Express request object with filename parameter
     * @param response - Express response object
     */
    static getImageByFilename(request: Request, response: Response): void {
        try {
            const { filename } = request.params;
            const imagePath = path.join(
                __dirname,
                "../../../uploads",
                filename,
            );

            // Check if file exists
            if (!fs.existsSync(imagePath)) {
                response.status(404).json({ message: "Image not found" });
                return;
            }

            // Determine content type based on extension
            const ext = path.extname(filename).toLowerCase();
            let contentType = "image/jpeg";

            switch (ext) {
                case ".png":
                    contentType = "image/png";
                    break;
                case ".gif":
                    contentType = "image/gif";
                    break;
                case ".webp":
                    contentType = "image/webp";
                    break;
                case ".jpg":
                case ".jpeg":
                    contentType = "image/jpeg";
                    break;
            }

            // Set headers and send file
            response.setHeader("Content-Type", contentType);
            response.setHeader("Cache-Control", "public, max-age=31557600");
            response.sendFile(imagePath);
        } catch (error) {
            console.error("Error fetching image:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Upload a new image
     * @param request - Authenticated request object with uploaded file
     * @param response - Express response object
     */
    static uploadImage(
        request: AuthenticatedRequest,
        response: Response,
    ): void {
        try {
            // Check if file was uploaded
            if (!request.file) {
                response.status(400).json({ message: "No file given." });
                return;
            }

            // Validate file type
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/webp",
            ];
            if (!allowedTypes.includes(request.file.mimetype)) {
                response.status(400).json({
                    message:
                        "Invalid file type. Allowed types: jpeg, jpg, png, gif, webp.",
                });
                return;
            }

            // Return upload success with file information
            const imageUrl = `/uploads/${request.file.filename}`;
            response.status(200).json({
                success: true,
                message: "Image uploaded successfully.",
                imageUrl: imageUrl,
                filename: request.file.filename,
                originalName: request.file.originalname,
                size: request.file.size,
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }
}
