import express from "express";
import { upload } from "@/middleware/upload";
import { authenticateToken, AuthenticatedRequest } from "@/middleware/auth";

const router = express.Router();

router.post(
    "/image",
    authenticateToken,
    upload.single("image"),
    (
        request: AuthenticatedRequest,
        response: express.Response,
        //next: NextFunction,
    ): void => {
        try {
            if (!request.file) {
                response.status(400).json({ message: "No file given." });
                return;
            }

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/webp",
            ];
            if (!allowedTypes.includes(request.file.mimetype)) {
                response
                    .status(400)
                    .json({
                        message:
                            "Invalid file type. Allowed types: jpeg, jpg, png, gif, webp.",
                    });
                return;
            }

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
            response.status(500).json({ message: `Server error: ${error}` });
            console.error("Error uploading image:", error);
        }
    },
);

export default router;
