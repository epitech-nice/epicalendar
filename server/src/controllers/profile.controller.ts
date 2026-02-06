/**
 * @file profile.controller.tsx
 * @brief Controller for handles user profile operations
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

import { Response } from "express";
import { Account, addGuardTime, formatAccountFields } from "@/models/account.model";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";

/**
 * ProfileController - Handles user profile operations
 * All methods are designed to work with authenticated requests
 */
export class ProfileController {
    /**
     * Get the current authenticated user's profile
     * @param request - The authenticated request containing user info
     * @param response - Express response object
     */
    static async getMe(
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> {
        try {
            // Verify user authentication
            if (!request.user || !request.user.id) {
                response.status(401).json({ message: "Unauthorized access." });
                return;
            }

            // Fetch account excluding password field
            const account = await Account.findById(
                request.user.id,
                "-password",
            );

            if (!account) {
                response.status(404).json({ message: "Account not found." });
                return;
            }

            // Convert to plain object and add guard time
            const accountJson = account.toObject();
            await addGuardTime(accountJson);

            response.json(accountJson);
        } catch (error) {
            console.error("Error fetching account:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Update the current authenticated user's profile
     * @param request - The authenticated request containing user info and update data
     * @param response - Express response object
     */
    static async updateMe(
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> {
        try {
            // Verify user authentication
            if (!request.user || !request.user.id) {
                response.status(401).json({ message: "Unauthorized access." });
                return;
            }

            // Check if email is already in use by another account
            if (request.body.email) {
                const existingAccount = await Account.findOne({
                    email: request.body.email,
                    _id: { $ne: request.user.id }, // Exclude current user
                });

                if (existingAccount) {
                    response.status(409).json({ message: "Email already in use." });
                    return;
                }
            }

            // Format and hash fields if provided
            const formattedFields = await formatAccountFields(
                request.body.first_name,
                request.body.last_name,
                request.body.password,
            );

            if (request.body.first_name) {
                request.body.first_name = formattedFields.first_name;
            }
            if (request.body.last_name) {
                request.body.last_name = formattedFields.last_name;
            }
            if (request.body.password) {
                request.body.password = formattedFields.password;
            }

            // Remove protected fields that shouldn't be updated
            delete request.body._id;
            delete request.body.created_at;
            delete request.body.role;

            // Update account with validated data
            const updatedAccount = await Account.findByIdAndUpdate(
                request.user.id,
                request.body,
                { new: true, runValidators: true },
            ).select("-password"); // Exclude password from response

            if (!updatedAccount) {
                response.status(404).json({ message: "Account not found." });
                return;
            }

            response.json(updatedAccount);
        } catch (error) {
            console.error("Error updating account:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }
}
