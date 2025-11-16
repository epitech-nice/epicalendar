import { Response, Router } from "express";
import { AuthenticatedRequest, authenticateToken } from "@/middleware/auth";
import { OpeningRequest } from "@/models/opening-request";

const router = Router();

router.get(
    "/opening-requests",
    authenticateToken,
    async (
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> => {
        try {
            if (request.user.role !== "student") {
                const openingRequests = await OpeningRequest.find().sort({
                    date: -1,
                });
                response.json(openingRequests);
            } else {
                const openingRequests = await OpeningRequest.find({
                    account: request.user.email,
                }).sort({ date: -1 });
                response.json(openingRequests);
            }
        } catch (error) {
            response.status(500).json({ message: `Server error: ${error}` });
            console.error("Error fetching opening requests:", error);
        }
    },
);

router.get(
    "/opening-requests/:id",
    authenticateToken,
    async (
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> => {
        try {
            const openingRequestId = request.params.id;
            const openingRequest =
                await OpeningRequest.findById(openingRequestId);

            if (!openingRequest) {
                response
                    .status(404)
                    .json({ message: "Opening request not found." });
                return;
            }

            if (
                request.user.role === "student" &&
                openingRequest.account !== request.user.email
            ) {
                response.status(403).json({
                    message: "You can only view your own opening requests.",
                });
                return;
            }

            response.json(openingRequest);
        } catch (error) {
            response.status(500).json({ message: `Server error: ${error}` });
            console.error("Error fetching opening request:", error);
        }
    },
);

export default router;
