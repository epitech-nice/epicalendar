import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { OpeningRequest } from "@/models/opening-request.model";

/**
 * OpeningRequestsController - Handles all opening request operations
 * CRUD operations for managing campus opening requests
 */
export class OpeningRequestsController {
    /**
     * Get all opening requests
     * Students see only their own requests, AER and admins see all
     * @param request - Authenticated request object
     * @param response - Express response object
     */
    static async getAllOpeningRequests(
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> {
        try {
            if (request.user.role !== "student") {
                // AER and admin can see all requests
                const openingRequests = await OpeningRequest.find().sort({
                    date: -1,
                });
                response.json(openingRequests);
            } else {
                // Students see only their own requests
                const openingRequests = await OpeningRequest.find({
                    account: request.user.email,
                }).sort({ date: -1 });
                response.json(openingRequests);
            }
        } catch (error) {
            console.error("Error fetching opening requests:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Get a specific opening request by ID
     * @param request - Authenticated request object with ID parameter
     * @param response - Express response object
     */
    static async getOpeningRequestById(
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> {
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

            // Students can only view their own requests
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
            console.error("Error fetching opening request:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Create a new opening request
     * @param request - Authenticated request object with opening request data
     * @param response - Express response object
     */
    static async createOpeningRequest(
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> {
        try {
            // Validate required fields
            if (
                !request.body.date &&
                !request.body.open &&
                !request.body.close &&
                !request.body.message
            ) {
                response.status(400).json({
                    message:
                        "Fields are missing. Please provide date, open, close, and message.",
                });
                return;
            }

            // Set date to midnight
            request.body.date = new Date(request.body.date);
            request.body.date.setHours(0, 0, 0, 0);

            // Set times relative to the date
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

            // Validate time logic
            if (request.body.open >= request.body.close) {
                response
                    .status(400)
                    .json({ message: "Open time must be before close time." });
                return;
            }

            // Set account from authenticated user
            request.body.account = request.user.email;

            // Remove protected fields
            delete request.body.status;
            delete request.body.response;
            delete request.body.created_at;

            // Create new opening request
            const newOpeningRequest = new OpeningRequest(request.body);
            await newOpeningRequest.save();

            response.status(201).json({
                message: "Opening request created successfully.",
                opening_request: newOpeningRequest,
            });
        } catch (error) {
            console.error("Error creating opening request:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Update an opening request by ID
     * @param request - Authenticated request object with ID parameter and update data
     * @param response - Express response object
     */
    static async updateOpeningRequest(
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> {
        try {
            const { id } = request.params;

            // Check if opening request exists
            const existingOpeningRequest = await OpeningRequest.findById(id);
            if (!existingOpeningRequest) {
                response
                    .status(404)
                    .json({ message: "Opening request not found." });
                return;
            }

            // Update times relative to existing or new date
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

            // Handle date change
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

            // Validate time logic for updates
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

            // Remove protected fields
            delete request.body.created_at;
            delete request.body.account;

            // Update opening request
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
            console.error("Error updating opening request:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Delete an opening request by ID
     * @param request - Authenticated request object with ID parameter
     * @param response - Express response object
     */
    static async deleteOpeningRequest(
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> {
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

            // Students can only delete their own requests
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
            console.error("Error deleting opening request:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }
}
