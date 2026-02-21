import { Router } from "express";
import { authenticateToken, authorizeAer } from "@/middlewares/auth.middleware";
import { DaysController } from "@/controllers/days.controller";

const router = Router();

// GET routes
router.get("/days", DaysController.getAllDays);
router.get("/days/current", DaysController.getCurrentDay);
router.get(
    "/days/:id",
    authenticateToken,
    authorizeAer,
    DaysController.getDayById,
);

// POST routes
router.post("/days", authenticateToken, authorizeAer, DaysController.createDay);

// PUT routes
router.put("/days/:id", authenticateToken, DaysController.updateDay);

// DELETE routes
router.delete(
    "/days/:id",
    authenticateToken,
    authorizeAer,
    DaysController.deleteDay,
);

export default router;
