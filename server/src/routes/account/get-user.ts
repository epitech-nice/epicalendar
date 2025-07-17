import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken } from '../../middleware/auth';



const router = Router();

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

router.get('/user', authenticateToken, async (request: AuthenticatedRequest, response: Response): Promise<void> => {
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
        response.json({
            user: {
                email: account.email,
                first_name: account.first_name,
                last_name: account.last_name,
                role: account.role,
                photo: account.photo,
            },
        });
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error fetching account:", err);
    }
});

export default router;
