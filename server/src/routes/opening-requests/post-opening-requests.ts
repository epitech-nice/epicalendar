import { Response, Router } from "express";
import { AuthenticatedRequest, authenticateToken } from "@/middleware/auth";
import { OpeningRequest } from "@/models/opening-request";

const router = Router();

router.post(
    "/opening-requests",
    authenticateToken,
    async (
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> => {
        try {
            if (
                !request.body.date &&
                !request.body.open &&
                !request.body.close &&
                !request.body.message
            ) {
                response
                    .status(400)
                    .json({
                        message:
                            "Fields are missing. Please provide date, open, close, and message.",
                    });
                return;
            }

            request.body.date = new Date(request.body.date);
            request.body.date.setHours(0, 0, 0, 0);
            const orignalOpen = new Date(request.body.open);
            request.body.open = new Date(request.body.date);
            request.body.open.setHours(
                orignalOpen.getHours(),
                orignalOpen.getMinutes(),
                0,
                0,
            );
            const orignalClose = new Date(request.body.close);
            request.body.close = new Date(request.body.date);
            request.body.close.setHours(
                orignalClose.getHours(),
                orignalClose.getMinutes(),
                0,
                0,
            );

            if (request.body.open >= request.body.close) {
                response
                    .status(400)
                    .json({ message: "Open time must be before close time." });
                return;
            }

            request.body.account = request.user.email;
            if (request.body.status) delete request.body.status;
            if (request.body.response) delete request.body.reponse;
            if (request.body.created_at) delete request.body.created_at;

            const newOpeningRequest = new OpeningRequest(request.body);
            await newOpeningRequest.save();
            response
                .status(201)
                .json({
                    message: "Opening request created successfully.",
                    opening_request: newOpeningRequest,
                });
        } catch (error) {
            response.status(500).json({ message: `Server error: ${error}` });
            console.error("Error creating opening request:", error);
        }
    },
);

export default router;
