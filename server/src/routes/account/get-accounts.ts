import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';



const router = Router();

router.get('/accounts', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        const accounts = await Account.find({}, '-password');
        response.json(accounts);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error fetching accounts:", err);
    }
});

router.get('/accounts/:id', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        const accountId = request.params.id;
        const account = await Account.findById(accountId, '-password');
        if (!account) {
            response.status(404).json({ error: 'Account not found.' });
            return;
        }
        response.json(account);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error fetching account:", err);
    }
});

export default router;
