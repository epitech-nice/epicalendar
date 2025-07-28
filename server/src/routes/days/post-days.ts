import { Request, Response, Router } from "express";
import {authenticateToken, authorizeAer} from "../../middleware/auth";
import {Day} from "../../models/day";
import {Account} from "../../models/account";



const router = Router();



router.post('/days', authenticateToken, authorizeAer, async (request: Request, response: Response): Promise<void> => {
    try {
        if (!request.body.date && !request.body.open && !request.body.start && !request.body.close) {
            response.status(400).json({ message: 'Fields are missing. Please provide date, open, start, and close.' });
            return;
        }

        request.body.date = new Date(request.body.date);
        request.body.date.setHours(0, 0, 0, 0);
        const existingDate = await Day.findOne({ date: request.body.date });
        if (existingDate) {
            response.status(409).json({ message: 'A day already exists for this date.' });
            return;
        }

        const orignalOpen = new Date(request.body.open);
        request.body.open = new Date(request.body.date);
        request.body.open.setHours(orignalOpen.getHours(), orignalOpen.getMinutes(), 0, 0);
        const orignalStart = new Date(request.body.start);
        request.body.start = new Date(request.body.date);
        request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
        const orignalClose = new Date(request.body.close);
        request.body.close = new Date(request.body.date);
        request.body.close.setHours(orignalClose.getHours(), orignalClose.getMinutes(), 0, 0);
        const orignalEnd = new Date(request.body.end);
        request.body.end = new Date(request.body.date);
        request.body.end.setHours(orignalEnd.getHours(), orignalEnd.getMinutes(), 0, 0);

        if (request.body.open >= request.body.close) {
            response.status(400).json({ message: 'Open time must be before close time.' });
            return;
        }
        if (request.body.start >= request.body.close) {
            response.status(400).json({ message: 'Guard start time must be before close time.' });
            return;
        }
        if (request.body.open > request.body.start) {
            response.status(400).json({ message: 'The guard start time must be between open and close time.' });
            return;
        }
        if (request.body.end && request.body.end < request.body.start) {
            response.status(400).json({ message: 'The guard end time must be after the guard start time.' });
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
