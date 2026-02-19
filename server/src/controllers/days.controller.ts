import { Request, Response } from "express";
import { Day } from "@/models/day.model";

/**
 * DaysController - Handles all day-related operations
 * CRUD operations for managing campus opening days
 */
export class DaysController {
    /**
     * Get all days sorted by date (descending) with pagination
     * @param request - Express request object
     * @param response - Express response object
     */
    static async getAllDays(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            // Pagination parameters
            const page = parseInt(request.query.page as string) || 1;
            const limit = parseInt(request.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            // Get total count for pagination metadata
            const total = await Day.countDocuments();

            // Fetch days with pagination and populate AERs
            const days = await Day.find()
                .select("-observations")
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .populate("aers", "first_name last_name email _id");

            response.json({
                days,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            console.error("Error fetching days:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Get the current day's information
     * @param request - Express request object
     * @param response - Express response object
     */
    static async getCurrentDay(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const currentDay = await Day.findOne({ date: today }).select(
                "-observations",
            );

            if (!currentDay) {
                response
                    .status(404)
                    .json({ message: "The campus is closed today." });
                return;
            }

            response.json(currentDay);
        } catch (error) {
            console.error("Error fetching current day:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Get a specific day by ID
     * @param request - Express request object with ID parameter
     * @param response - Express response object
     */
    static async getDayById(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            const dayId = request.params.id;
            const day = await Day.findById(dayId).populate(
                "aers",
                "first_name last_name email _id",
            );

            if (!day) {
                response.status(404).json({ message: "Day not found." });
                return;
            }

            response.json(day);
        } catch (error) {
            console.error("Error fetching day:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Create a new day
     * @param request - Express request object with day data
     * @param response - Express response object
     */
    static async createDay(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            // Validate required fields
            if (
                !request.body.date &&
                !request.body.open &&
                !request.body.start &&
                !request.body.close
            ) {
                response.status(400).json({
                    message:
                        "Fields are missing. Please provide date, open, start, and close.",
                });
                return;
            }

            // Set date to midnight
            request.body.date = new Date(request.body.date);
            request.body.date.setHours(0, 0, 0, 0);

            // Check if day already exists for this date
            const existingDate = await Day.findOne({ date: request.body.date });
            if (existingDate) {
                response
                    .status(409)
                    .json({ message: "A day already exists for this date." });
                return;
            }

            // Set times relative to the date
            const orignalOpen = new Date(request.body.open);
            request.body.open = new Date(request.body.date);
            request.body.open.setHours(
                orignalOpen.getHours(),
                orignalOpen.getMinutes(),
                0,
                0,
            );

            const orignalStart = new Date(request.body.start);
            request.body.start = new Date(request.body.date);
            request.body.start.setHours(
                orignalStart.getHours(),
                orignalStart.getMinutes(),
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

            if (request.body.end) {
                const orignalEnd = new Date(request.body.end);
                request.body.end = new Date(request.body.date);
                request.body.end.setHours(
                    orignalEnd.getHours(),
                    orignalEnd.getMinutes(),
                    0,
                    0,
                );
            }

            // Validate time logic
            if (request.body.open >= request.body.close) {
                response
                    .status(400)
                    .json({ message: "Open time must be before close time." });
                return;
            }
            if (request.body.start >= request.body.close) {
                response.status(400).json({
                    message: "Guard start time must be before close time.",
                });
                return;
            }
            if (request.body.open > request.body.start) {
                response.status(400).json({
                    message:
                        "The guard start time must be between open and close time.",
                });
                return;
            }
            if (request.body.end && request.body.end < request.body.start) {
                response.status(400).json({
                    message:
                        "The guard end time must be after the guard start time.",
                });
                return;
            }

            // Create new day
            const newDay = new Day(request.body);
            await newDay.save();

            response
                .status(201)
                .json({ message: "Day created successfully.", day: newDay });
        } catch (error) {
            console.error("Error creating day:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Update a day by ID
     * @param request - Express request object with ID parameter and update data
     * @param response - Express response object
     */
    static async updateDay(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            const { id } = request.params;

            // Check if day exists
            const existingDay = await Day.findById(id);
            if (!existingDay) {
                response.status(404).json({ message: "Day not found." });
                return;
            }

            // Update times relative to existing or new date
            if (request.body.open) {
                const orignalOpen = new Date(request.body.open);
                request.body.open = new Date(existingDay.date);
                request.body.open.setHours(
                    orignalOpen.getHours(),
                    orignalOpen.getMinutes(),
                    0,
                    0,
                );
            }

            if (request.body.start) {
                const orignalStart = new Date(request.body.start);
                request.body.start = new Date(existingDay.date);
                request.body.start.setHours(
                    orignalStart.getHours(),
                    orignalStart.getMinutes(),
                    0,
                    0,
                );
            }

            if (request.body.close) {
                const orignalClose = new Date(request.body.close);
                request.body.close = new Date(existingDay.date);
                request.body.close.setHours(
                    orignalClose.getHours(),
                    orignalClose.getMinutes(),
                    0,
                    0,
                );
            }

            if (request.body.end) {
                const orignalEnd = new Date(request.body.end);
                request.body.end = new Date(existingDay.date);
                request.body.end.setHours(
                    orignalEnd.getHours(),
                    orignalEnd.getMinutes(),
                    0,
                    0,
                );
            }

            // Handle date change
            if (request.body.date) {
                request.body.date = new Date(request.body.date);
                request.body.date.setHours(0, 0, 0, 0);

                const existingDate = await Day.findOne({
                    date: request.body.date,
                });
                if (existingDate) {
                    response.status(409).json({
                        message: "A day already exists for this date.",
                    });
                    return;
                }

                // Recalculate all times for new date
                const orignalOpen = request.body.open
                    ? new Date(request.body.open)
                    : existingDay.open;
                request.body.open = new Date(request.body.date);
                request.body.open.setHours(
                    orignalOpen.getHours(),
                    orignalOpen.getMinutes(),
                    0,
                    0,
                );

                const orignalStart = request.body.start
                    ? new Date(request.body.start)
                    : existingDay.start;
                request.body.start = new Date(request.body.date);
                request.body.start.setHours(
                    orignalStart.getHours(),
                    orignalStart.getMinutes(),
                    0,
                    0,
                );

                const orignalClose = request.body.close
                    ? new Date(request.body.close)
                    : existingDay.close;
                request.body.close = new Date(request.body.date);
                request.body.close.setHours(
                    orignalClose.getHours(),
                    orignalClose.getMinutes(),
                    0,
                    0,
                );

                const orignalEnd = request.body.end
                    ? new Date(request.body.end)
                    : existingDay.end;
                if (orignalEnd) {
                    request.body.end = new Date(request.body.date);
                    request.body.end.setHours(
                        orignalEnd.getHours(),
                        orignalEnd.getMinutes(),
                        0,
                        0,
                    );
                }
            }

            // Validate time logic for updates
            if (
                (request.body.open &&
                    request.body.close &&
                    request.body.open >= request.body.close) ||
                (request.body.open &&
                    !request.body.close &&
                    request.body.open >= existingDay.close) ||
                (!request.body.open &&
                    request.body.close &&
                    existingDay.open >= request.body.close)
            ) {
                response
                    .status(400)
                    .json({ message: "Open time must be before close time." });
                return;
            }
            if (
                (request.body.start &&
                    request.body.close &&
                    request.body.start >= request.body.close) ||
                (request.body.start &&
                    !request.body.close &&
                    request.body.start >= existingDay.close) ||
                (!request.body.start &&
                    request.body.close &&
                    existingDay.start >= request.body.close)
            ) {
                response.status(400).json({
                    message: "Guard start time must be before close time.",
                });
                return;
            }
            if (
                (request.body.open &&
                    request.body.start &&
                    request.body.open > request.body.start) ||
                (request.body.open &&
                    !request.body.start &&
                    request.body.open > existingDay.start) ||
                (!request.body.open &&
                    request.body.start &&
                    existingDay.open > request.body.start)
            ) {
                response.status(400).json({
                    message:
                        "The guard start time must be between open and close time.",
                });
                return;
            }
            if (
                (request.body.end &&
                    request.body.start &&
                    request.body.end < request.body.start) ||
                (request.body.end &&
                    !request.body.start &&
                    request.body.end < existingDay.start)
            ) {
                response.status(400).json({
                    message:
                        "The guard end time must be after the guard start time.",
                });
                return;
            }

            // Update day
            const updatedDay = await Day.findByIdAndUpdate(id, request.body, {
                new: true,
                runValidators: true,
            });

            response.status(200).json({
                message: "Day updated successfully.",
                account: updatedDay,
            });
        } catch (error) {
            console.error("Error updating day:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Delete a day by ID
     * @param request - Express request object with ID parameter
     * @param response - Express response object
     */
    static async deleteDay(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            if (!request.params.id) {
                response.status(400).json({ message: "Day ID is required." });
                return;
            }

            const deletedDay = await Day.findByIdAndDelete(request.params.id);
            if (!deletedDay) {
                response.status(404).json({ message: "Day not found" });
                return;
            }

            response.json({ message: `Day ${request.params.id} deleted` });
        } catch (error) {
            console.error("Error deleting day:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }
}
