import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';
import bcrypt from "bcrypt";



const router = Router();



router.put('/accounts/:id', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const updateData = request.body;

        const existingAccount = await Account.findById(id);
        if (!existingAccount) {
            response.status(404).json({ error: 'Account not found.' });
            return;
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        if (updateData.email && updateData.email !== existingAccount.email) {
            const emailExists = await Account.findOne({ email: updateData.email });
            if (emailExists) {
                response.status(409).json({ error: 'Email already in use.' });
                return;
            }
        }

        if (updateData.first_name) {
            updateData.first_name = updateData.first_name
                .split(/[-\s]/)
                .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(updateData.first_name.includes('-') ? '-' : ' ');
        }

        if (updateData.last_name) {
            updateData.last_name = updateData.last_name.toUpperCase();
        }

        const updatedAccount = await Account.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        response.status(200).json({ // TODO: sa renvoie peut etre le mot de passe haché dans la réponse
            message: 'Account updated successfully.',
            account: updatedAccount 
        });

    } catch (error) {
        response.status(500).json({ message: 'Server error.', details: error });
        console.error(error);
    }
});



export default router;
