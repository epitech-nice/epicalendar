import { Router } from "express";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { AuthController } from "@/controllers/auth.controller";

const router = Router();

// GET routes
router.get("/user", authenticateToken, AuthController.getUser);

// POST routes
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

export default router;
