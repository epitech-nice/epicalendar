import { Request, Response, Router } from "express";
import {authenticateToken, authorizeAer} from '../../middleware/auth';
import { Day } from "../../models/day";



const router = Router();



router.get('/days', async (request: Request, response: Response): Promise<void> => {
    try {
        const days = await Day.find().select('-observations').sort({ date: -1 });
        response.json(days);

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error("Error fetching days:", error);
    }
});



router.get('/days/current', async (request: Request, response: Response): Promise<void> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDay = await Day.findOne({ date: today }).select('-observations');

        if (!currentDay) {
            response.status(404).json({ message: 'No current day found.' });
            return;
        }

        response.json(currentDay);

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error("Error fetching day:", error);
    }
});



router.get('/days/:id', authenticateToken, authorizeAer, async (request: Request, response: Response): Promise<void> => {
    try {
        const dayId = request.params.id;
        const day = await Day.findById(dayId);

        if (!day) {
            response.status(404).json({ message: 'Day not found.' });
            return;
        }

        response.json(day);

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error("Error fetching day:", error);
    }
});



export default router;
