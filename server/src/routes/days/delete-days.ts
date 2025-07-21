import { Request, Response, Router } from "express";
import { authenticateToken, authorizeAer } from '../../middleware/auth';
import {Day} from "../../models/day";



const router = Router();



router.delete('/days/:id', authenticateToken, authorizeAer, async (request: Request, response: Response): Promise<void> => {
    try {
        if (!request.params.id) {
            response.status(400).json({ error: 'Day ID is required.' });
            return;
        }

        const deletedDay = await Day.findByIdAndDelete(request.params.id);
        if (!deletedDay) {
            response.status(404).json({ error: 'Day not found' });
            return;
        }

        response.json({ message: `Day ${request.params.id} deleted` });

    } catch (error) {
        response.status(500).json({ message: 'Server error', details: error });
        console.error("Error deleting day:", error);
    }
});



export default router;
