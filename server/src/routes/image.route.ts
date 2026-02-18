import express from "express";
import { ImagesController } from "@/controllers/images.controller";
import {authenticateToken} from "@/middlewares/auth.middleware";
import {upload} from "@/middlewares/upload.middleware";

const router = express.Router();

// GET routes
router.get(
    "/images",
    ImagesController.getImages
);
router.get(
    "/image/:filename",
    ImagesController.getImageByFilename
);

// POST routes
router.post(
    "/image",
    authenticateToken,
    upload.single("image"),
    ImagesController.uploadImage,
);

export default router;
