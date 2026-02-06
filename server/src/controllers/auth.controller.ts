import { Request, Response } from "express";
import { Account, formatAccountFields, generateToken } from "@/models/account.model";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import bcrypt from "bcrypt";

/**
 * AuthController - Handles authentication and user operations
 * Login, registration, and user information retrieval
 */
export class AuthController {
    /**
     * Authenticate user and generate access token
     * @param request - Express request object with email and password
     * @param response - Express response object
     */
    static async login(request: Request, response: Response): Promise<void> {
        try {
            const { email, password } = request.body;

            // Validate required fields
            if (!email || !password) {
                response.status(400).json({
                    message:
                        "Fields are missing. Please provide email and password.",
                });
                return;
            }

            // Find user by email
            const user = await Account.findOne({ email });
            if (!user) {
                response
                    .status(401)
                    .json({ message: "Invalid email or password." });
                console.log("Login attempt with non-existent email:", email);
                return;
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                response
                    .status(401)
                    .json({ message: "Invalid email or password." });
                console.log(
                    "Login attempt with incorrect password for email:",
                    email,
                );
                return;
            }

            // Generate token and return user data
            response.json({
                message: "Login successful.",
                token: generateToken(user._id, user.email, user.role),
                user: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                    photo: user.photo,
                },
            });
        } catch (error) {
            console.error("Error during login:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Register a new user account
     * @param request - Express request object with user registration data
     * @param response - Express response object
     */
    static async register(
        request: Request,
        response: Response,
    ): Promise<void> {
        try {
            const { email, first_name, last_name, password } = request.body;

            // Validate required fields
            if (!email || !first_name || !last_name || !password) {
                response.status(400).json({
                    message:
                        "Fields are missing. Please provide email, first name, last name, and password.",
                });
                return;
            }

            // Check if email already exists
            const existing = await Account.findOne({ $or: [{ email }] });
            if (existing) {
                response.status(409).json({ message: "Email already exists." });
                return;
            }

            // Format and hash user data
            const formattedFields = await formatAccountFields(
                first_name,
                last_name,
                password,
            );

            // Create new account
            const account = new Account({
                email,
                first_name: formattedFields.first_name,
                last_name: formattedFields.last_name,
                password: formattedFields.password,
            });
            await account.save();

            response.status(201).json({
                message: "Account created successfully.",
                user: {
                    email: account.email,
                    first_name: account.first_name,
                    last_name: account.last_name,
                    role: account.role,
                    photo: account.photo,
                },
            });
        } catch (error) {
            console.error("Error during registration:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }

    /**
     * Get authenticated user information
     * @param request - Authenticated request object
     * @param response - Express response object
     */
    static async getUser(
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> {
        try {
            // Verify authentication
            if (!request.user || !request.user.id) {
                response.status(401).json({ message: "Unauthorized access." });
                return;
            }

            // Fetch user account
            const account = await Account.findById(
                request.user.id,
                "-password",
            );
            if (!account) {
                response.status(404).json({ message: "Account not found." });
                return;
            }

            response.json({
                user: {
                    email: account.email,
                    first_name: account.first_name,
                    last_name: account.last_name,
                    role: account.role,
                    photo: account.photo,
                },
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            response.status(500).json({ message: `Server error: ${error}` });
        }
    }
}
