import { Request, Response, Router } from "express";
import { Account, formatAccountFields } from "@/models/account";
import { authenticateToken, authorizeAdmin } from "@/middleware/auth";

const router = Router();

router.post(
    "/accounts",
    authenticateToken,
    authorizeAdmin,
    async (request: Request, response: Response): Promise<void> => {
        try {
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

            const existingAccount = await Account.findOne({
                email: request.body.email,
            });
            if (existingAccount) {
                response.status(409).json({ message: "Email already in use." });
                return;
            }

            const formattedFields = await formatAccountFields(
                request.body.first_name,
                request.body.last_name,
                request.body.password,
            );
            request.body.first_name = formattedFields.first_name;
            request.body.last_name = formattedFields.last_name;
            request.body.password = formattedFields.password;

            if (request.body._id) delete request.body._id;
            if (request.body.created_at) delete request.body.created_at;

            const newAccount = new Account(request.body);
            await newAccount.save();
            response.status(201).json({
                message: "Account created successfully.",
                account: newAccount,
            });
        } catch (error) {
            response.status(500).json({ message: `Server error: ${error}` });
            console.error("Error creating account:", error);
        }
    },
);

export default router;
