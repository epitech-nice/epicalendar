import { Response, Router } from "express";
import { Account, formatAccountFields } from "@/models/account";
import { authenticateToken, AuthenticatedRequest } from "@/middleware/auth";

const router = Router();

router.put(
    "/me",
    authenticateToken,
    async (
        request: AuthenticatedRequest,
        response: Response,
    ): Promise<void> => {
        try {
            if (!request.user || !request.user.id) {
                response.status(401).json({ message: "Unauthorized access." });
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
            if (request.body.first_name) {
                request.body.first_name = formattedFields.first_name;
            }
            if (request.body.last_name) {
                request.body.last_name = formattedFields.last_name;
            }
            if (request.body.password) {
                request.body.password = formattedFields.password;
            }

            if (request.body._id) delete request.body._id;
            if (request.body.created_at) delete request.body.created_at;
            if (request.body.role) delete request.body.role;

            const updatedAccount = await Account.findByIdAndUpdate(
                request.user.id,
                request.body,
                { new: true, runValidators: true },
            );
            if (!updatedAccount) {
                response.status(404).json({ message: "Account not found." });
                return;
            }

            response.json(updatedAccount);
        } catch (error) {
            response.status(500).json({ message: `Server error: ${error}` });
            console.error("Error updating account:", error);
        }
    },
);

export default router;
