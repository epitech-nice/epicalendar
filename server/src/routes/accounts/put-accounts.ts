import { Request, Response, Router } from "express";
import {Account, formatAccountFields} from "../../models/account";
import { authenticateToken, authorizeAdmin } from "../../middleware/auth";
import bcrypt from "bcrypt";



const router = Router();



router.put('/accounts/:id', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;

        const existingAccount = await Account.findById(id);
        if (!existingAccount) {
            response.status(404).json({ message: 'Account not found.' });
            return;
        }

        if (request.body.email && request.body.email !== existingAccount.email) {
            const emailExists = await Account.findOne({ email: request.body.email });
            if (emailExists) {
                response.status(409).json({ message: 'Email already in use.' });
                return;
            }
        }

        const formattedFields = await formatAccountFields(request.body.first_name, request.body.last_name, request.body.password);
        if (request.body.first_name) {
            request.body.first_name = formattedFields.first_name;
        }
        if (request.body.last_name) {
            request.body.last_name = formattedFields.last_name;
        }
        if (request.body.password) {
            request.body.password = formattedFields.password;
        }

        if (request.body._id)
            delete request.body._id;
        if (request.body.created_at)
            delete request.body.created_at;

        let updatedAccount = await Account.findByIdAndUpdate(
            id,
            request.body,
            { new: true, runValidators: true }
        );
        updatedAccount = await Account.findById(id, "-password");

        response.status(200).json({
            message: 'Account updated successfully.',
            account: updatedAccount 
        });

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error(error);
    }
});



export default router;
