import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';



const router = Router();



router.delete('/accounts/:id', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        if (!request.params.id) {
            response.status(400).json({ message: 'Account ID is required.' });
            return;
        }
        //console.log("Attempting to delete account with ID:", request.params.id);

        const deletedAccount = await Account.findByIdAndDelete(request.params.id);
        if (!deletedAccount) {
            response.status(404).json({ message: 'Account not found' });
            return;
        }

        response.json({ message: `Account ${request.params.id} deleted` });

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error("Error deleting account:", error);
    }
});



export default router;
