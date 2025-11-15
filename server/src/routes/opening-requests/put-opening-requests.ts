import { Response, Router } from "express";
import {
    AuthenticatedRequest,
    authenticateToken,
    authorizeAer,
} from "@/middleware/auth";
import { OpeningRequest } from "@/models/opening-request";

const router = Router();

router.put(
    "/opening-requests/:id",
    authenticateToken,
    authorizeAer,
    async (
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> => {
        try {
            const { id } = request.params;

            const existingOpeningRequest = await OpeningRequest.findById(id);
            if (!existingOpeningRequest) {
                response
                    .status(404)
                    .json({ message: "Opening request not found." });
                return;
            }

            if (request.body.open) {
                const orignalOpen = new Date(request.body.open);
                request.body.open = new Date(existingOpeningRequest.date);
                request.body.open.setHours(
                    orignalOpen.getHours(),
                    orignalOpen.getMinutes(),
                    0,
                    0,
                );
            }

            if (request.body.close) {
                const orignalClose = new Date(request.body.close);
                request.body.close = new Date(existingOpeningRequest.date);
                request.body.close.setHours(
                    orignalClose.getHours(),
                    orignalClose.getMinutes(),
                    0,
                    0,
                );
            }

            if (request.body.date) {
                request.body.date = new Date(request.body.date);
                request.body.date.setHours(0, 0, 0, 0);
                const orignalOpen = request.body.open
                    ? new Date(request.body.open)
                    : existingOpeningRequest.open;
                request.body.open = new Date(request.body.date);
                request.body.open.setHours(
                    orignalOpen.getHours(),
                    orignalOpen.getMinutes(),
                    0,
                    0,
                );
                const orignalClose = request.body.close
                    ? new Date(request.body.close)
                    : existingOpeningRequest.close;
                request.body.close = new Date(request.body.date);
                request.body.close.setHours(
                    orignalClose.getHours(),
                    orignalClose.getMinutes(),
                    0,
                    0,
                );
            }

            if (
                (request.body.open &&
                    request.body.close &&
                    request.body.open >= request.body.close) ||
                (request.body.open &&
                    !request.body.close &&
                    request.body.open >= existingOpeningRequest.close) ||
                (!request.body.open &&
                    request.body.close &&
                    existingOpeningRequest.open >= request.body.close)
            ) {
                response
                    .status(400)
                    .json({ message: "Open time must be before close time." });
                return;
            }

            if (request.body.created_at) delete request.body.created_at;
            if (request.body.account) delete request.body.account;

            const updatedOpeningRequest =
                await OpeningRequest.findByIdAndUpdate(id, request.body, {
                    new: true,
                    runValidators: true,
                });

            response.status(200).json({
                message: "Opening request updated successfully.",
                opening_request: updatedOpeningRequest,
            });
        } catch (error) {
            response.status(500).json({ message: `Server error: ${error}` });
            console.error(error);
        }
    },
);

export default router;
