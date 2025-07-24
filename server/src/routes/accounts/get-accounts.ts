import { Request, Response, Router } from "express";
import {Account, addGuardTime} from "../../models/account";
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

        for (const account of accounts) {
            await addGuardTime(account);
        }
        response.json(accounts);

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error("Error fetching accounts:", error);
    }
});



router.get('/accounts/aer', authenticateToken, async (request: Request, response: Response): Promise<void> => {
    try {
        const accounts = await Account.find({ role: 'aer' }, '-password').sort({ email: 1 });
        let accountsJson = [];

        for (const account of accounts) {
            const accountJson = account.toObject();
            await addGuardTime(accountJson);
            accountsJson.push(accountJson);
        }
        response.json(accountsJson);

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error("Error fetching account:", error);
    }
});



router.get('/accounts/:id', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        const accountId = request.params.id;
        const account = await Account.findById(accountId, '-password');

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
