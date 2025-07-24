import { Request, Response, Router } from "express";
import {Account, addGuardTime} from "../../models/account";
import { authenticateToken, AuthenticatedRequest } from "../../middleware/auth";



const router = Router();



router.get('/me', authenticateToken, async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
        if (!request.user || !request.user.id) {
            response.status(401).json({ message: 'Unauthorized access.' });
            return;
        }

        const account = await Account.findById(request.user.id, '-password');
        if (!account) {
            response.status(404).json({ message: 'Account not found.' });
            return;
        }

        const accountJson = account.toObject();
        await addGuardTime(accountJson);
        response.json(accountJson);

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error("Error fetching account:", error);
    }
});



export default router;
