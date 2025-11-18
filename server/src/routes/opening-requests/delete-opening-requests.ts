import { Response, Router } from "express";
import { OpeningRequest } from "@/models/opening-request";
import { AuthenticatedRequest, authenticateToken } from "@/middleware/auth";

const router = Router();

router.delete(
    "/opening-requests/:id",
    authenticateToken,
    async (
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> => {
        try {
            if (!request.params.id) {
                response
                    .status(400)
                    .json({ message: "Opening request ID is required." });
                return;
            }

            const deletedOpeningRequest =
                await OpeningRequest.findByIdAndDelete(request.params.id);
            if (!deletedOpeningRequest) {
                response
                    .status(404)
                    .json({ message: "Opening request not found" });
                return;
            }

            if (
                request.user?.role === "student" &&
                deletedOpeningRequest.account !== request.user.email
            ) {
                response.status(403).json({
                    message: "You can only delete your own opening requests.",
                });
                return;
            }

            response.json({
                message: `Opening request ${request.params.id} deleted`,
            });
        } catch (error) {
            response.status(500).json({ message: `Server error: ${error}` });
            console.error("Error deleting opening request:", error);
        }
    },
);

export default router;
