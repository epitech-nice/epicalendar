import { Request, Response } from "express";
import {
    Account,
    addGuardTime,
    formatAccountFields,
} from "@/models/account.model";

/**
 * AccountsController - Handles all account-related operations
 * CRUD operations for managing user accounts (admin-only operations)
 */
export class AccountsController {
    /**
     * Get all accounts sorted by role and email
     * @param request - Express request object
     * @param response - Express response object
     */
    static async getAllAccounts(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            // Sort accounts by role (admin, aer, student) and then by email
            const accounts = await Account.aggregate([
                {
                    $addFields: {
                        role_order: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$role", "admin"] },
                                        then: 0,
                                    },
                                    {
                                        case: { $eq: ["$role", "aer"] },
                                        then: 1,
                                    },
                                    {
                                        case: { $eq: ["$role", "student"] },
                                        then: 2,
                                    },
                                ],
                                default: 3,
                            },
                        },
                    },
                },
                { $sort: { role_order: 1, email: 1 } },
                { $project: { password: 0, role_order: 0 } },
            ]);

            // Add guard time to each account
            for (const account of accounts) {
                await addGuardTime(account);
            }

            response.json(accounts);
        } catch (error) {
            console.error("Error fetching accounts:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Get all AER accounts
     * @param request - Express request object
     * @param response - Express response object
     */
    static async getAerAccounts(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            const accounts = await Account.find(
                { role: "aer" },
                "-password",
            ).sort({ email: 1 });

            const accountsJson = [];
            for (const account of accounts) {
                const accountJson = account.toObject();
                await addGuardTime(accountJson);
                accountsJson.push(accountJson);
            }

            response.json(accountsJson);
        } catch (error) {
            console.error("Error fetching AER accounts:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Get a specific account by ID
     * @param request - Express request object with ID parameter
     * @param response - Express response object
     */
    static async getAccountById(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            const accountId = request.params.id;
            const account = await Account.findById(accountId, "-password");

            if (!account) {
                response.status(404).json({ message: "Account not found." });
                return;
            }

            const accountJson = account.toObject();
            await addGuardTime(accountJson);
            response.json(accountJson);
        } catch (error) {
            console.error("Error fetching account:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Create a new account
     * @param request - Express request object with account data
     * @param response - Express response object
     */
    static async createAccount(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            // Validate required fields
            if (
                !request.body.email ||
                !request.body.first_name ||
                !request.body.last_name ||
                !request.body.password
            ) {
                response.status(400).json({
                    message:
                        "Fields are missing. Please provide email, first name, last name, password, and role.",
                });
                return;
            }

            // Check if email already exists
            const existingAccount = await Account.findOne({
                email: request.body.email,
            });
            if (existingAccount) {
                response.status(409).json({ message: "Email already in use." });
                return;
            }

            // Format and hash fields
            const formattedFields = await formatAccountFields(
                request.body.first_name,
                request.body.last_name,
                request.body.password,
            );
            request.body.first_name = formattedFields.first_name;
            request.body.last_name = formattedFields.last_name;
            request.body.password = formattedFields.password;

            // Remove protected fields
            delete request.body._id;
            delete request.body.created_at;

            // Create new account
            const newAccount = new Account(request.body);
            await newAccount.save();

            response.status(201).json({
                message: "Account created successfully.",
                account: newAccount,
            });
        } catch (error) {
            console.error("Error creating account:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Update an account by ID
     * @param request - Express request object with ID parameter and update data
     * @param response - Express response object
     */
    static async updateAccount(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            const { id } = request.params;

            // Check if account exists
            const existingAccount = await Account.findById(id);
            if (!existingAccount) {
                response.status(404).json({ message: "Account not found." });
                return;
            }

            // Check if email is being changed and if it's already in use
            if (
                request.body.email &&
                request.body.email !== existingAccount.email
            ) {
                const emailExists = await Account.findOne({
                    email: request.body.email,
                });
                if (emailExists) {
                    response
                        .status(409)
                        .json({ message: "Email already in use." });
                    return;
                }
            }

            // Format fields if provided
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

            // Remove protected fields
            delete request.body._id;
            delete request.body.created_at;

            // Update account
            await Account.findByIdAndUpdate(id, request.body, {
                new: true,
                runValidators: true,
            });

            // Fetch updated account without password
            const updatedAccount = await Account.findById(id, "-password");
            if (!updatedAccount) {
                response
                    .status(404)
                    .json({ message: "Account not found after update." });
                return;
            }

            const accountJson = updatedAccount.toObject();
            await addGuardTime(accountJson);

            response.status(200).json({
                message: "Account updated successfully.",
                account: accountJson,
            });
        } catch (error) {
            console.error("Error updating account:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Delete an account by ID
     * @param request - Express request object with ID parameter
     * @param response - Express response object
     */
    static async deleteAccount(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            if (!request.params.id) {
                response
                    .status(400)
                    .json({ message: "Account ID is required." });
                return;
            }

            const deletedAccount = await Account.findByIdAndDelete(
                request.params.id,
            );
            if (!deletedAccount) {
                response.status(404).json({ message: "Account not found" });
                return;
            }

            response.json({ message: `Account ${request.params.id} deleted` });
        } catch (error) {
            console.error("Error deleting account:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }
}
