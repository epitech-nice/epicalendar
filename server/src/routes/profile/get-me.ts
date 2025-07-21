import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, AuthenticatedRequest } from "../../middleware/auth";



const router = Router();



router.get('/me', authenticateToken, async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
        if (!request.user || !request.user.id) {
            response.status(401).json({ error: 'Unauthorized access.' });
            return;
        }

        const account = await Account.findById(request.user.id, '-password');
        if (!account) {
            response.status(404).json({ error: 'Account not found.' });
            return;
        }

        response.json(account);

    } catch (error) {
        response.status(500).json({ message: 'Server error.', details: error });
        console.error("Error fetching account:", error);
    }
});



export default router;
