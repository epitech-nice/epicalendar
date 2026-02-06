import { Router } from "express";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { ProfileController } from "@/controllers/profile.controller";

const router = Router();

// GET routes
router.get(
    "/me",
    authenticateToken,
    ProfileController.getMe
);

// PUT routes
router.put(
    "/me",
    authenticateToken,
    ProfileController.updateMe
);

export default router;
