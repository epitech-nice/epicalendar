import { Router } from "express";
import { authenticateToken, authorizeAer } from "@/middlewares/auth.middleware";
import { OpeningRequestsController } from "@/controllers/opening-requests.controller";

const router = Router();

// GET routes
router.get(
    "/opening-requests",
    authenticateToken,
    OpeningRequestsController.getAllOpeningRequests,
);
router.get(
    "/opening-requests/:id",
    authenticateToken,
    OpeningRequestsController.getOpeningRequestById,
);

// POST routes
router.post(
    "/opening-requests",
    authenticateToken,
    OpeningRequestsController.createOpeningRequest,
);

// PUT routes
router.put(
    "/opening-requests/:id",
    authenticateToken,
    authorizeAer,
    OpeningRequestsController.updateOpeningRequest,
);

// DELETE routes
router.delete(
    "/opening-requests/:id",
    authenticateToken,
    OpeningRequestsController.deleteOpeningRequest,
);

export default router;
