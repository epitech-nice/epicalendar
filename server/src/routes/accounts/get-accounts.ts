import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin, authorizeAer } from '../../middleware/auth';



const router = Router();



router.get('/accounts', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        //const accounts = await Account.find({}, '-password');
        // sort accounts by role and email
        const accounts = await Account.aggregate([
            {
                $addFields: {
                    role_order: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$role", "admin"] }, then: 0 },
                                { case: { $eq: ["$role", "aer"] }, then: 1 },
                                { case: { $eq: ["$role", "student"] }, then: 2 }
                            ],
                            default: 3
                        }
                    }
                }
            },
            { $sort: { role_order: 1, email: 1 } },
            { $project: { password: 0, role_order: 0 } }
        ]);

        response.json(accounts);

    } catch (error) {
        response.status(500).json({ message: 'Server error.', details: error });
        console.error("Error fetching accounts:", error);
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

    } catch (error) {
        response.status(500).json({ message: 'Server error.', details: error });
        console.error("Error fetching account:", error);
    }
});

router.get('/accounts/aer', authenticateToken, authorizeAer, async (request: Request, response: Response): Promise<void> => {
    try {
        const accounts = await Account.find({ role: 'aer' }, '-password').sort({ email: 1 });
        response.json(accounts);

    } catch (error) {
        response.status(500).json({ message: 'Server error.', details: error });
        console.error("Error fetching account:", error);
    }
});



export default router;
