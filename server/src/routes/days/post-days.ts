import { Request, Response, Router } from "express";
import {authenticateToken, authorizeAer} from "../../middleware/auth";
import {Day} from "../../models/day";
import {Account} from "../../models/account";



const router = Router();


//TODO: faut que sa mette à jour le compte des heures des aer
router.post('/days', authenticateToken, authorizeAer, async (request: Request, response: Response): Promise<void> => {
    try {
        if (!request.body.date && !request.body.start && !request.body.start_at && !request.body.end) {
            response.status(400).json({ message: 'Fields are missing. Please provide date, start, start_at, and end.' });
            return;
        }

        request.body.date = new Date(request.body.date);
        request.body.date.setHours(0, 0, 0, 0);
        const existingDate = await Day.findOne({ date: request.body.date });
        if (existingDate) {
            response.status(409).json({ message: 'A day already exists for this date.' });
            return;
        }

        const orignalStart = new Date(request.body.start);
        request.body.start = new Date(request.body.date);
        request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
        const orignalStartAt = new Date(request.body.start_at);
        request.body.start_at = new Date(request.body.date);
        request.body.start_at.setHours(orignalStartAt.getHours(), orignalStartAt.getMinutes(), 0, 0);
        const orignalEnd = new Date(request.body.end);
        request.body.end = new Date(request.body.date);
        request.body.end.setHours(orignalEnd.getHours(), orignalEnd.getMinutes(), 0, 0);

        if (request.body.start >= request.body.end) {
            response.status(400).json({ message: 'Start time must be before end time.' });
            return;
        }
        if (request.body.start_at >= request.body.end) {
            response.status(400).json({ message: 'Guard start time must be before end time.' });
            return;
        }
        if (request.body.start > request.body.start_at) {
            response.status(400).json({ message: 'The guard start time must be between start and end time.' });
            return;
        }

        const newDay = new Day(request.body);
        await newDay.save();
        response.status(201).json({ message: 'Day created successfully.', day: newDay });

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error("Error creating day:", error);
    }
});



export default router;
