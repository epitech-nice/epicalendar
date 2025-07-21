import { Request, Response, Router } from "express";
import {authenticateToken, authorizeAer} from "../../middleware/auth";
import {OpeningRequest} from "../../models/opening-request";



const router = Router();



router.post('/days', authenticateToken, authorizeAer, async (request: Request, response: Response): Promise<void> => {
    try {
        if (!request.body.date && !request.body.start && !request.body.start_at && !request.body.end) {
            response.status(400).json({ error: 'Fields are missing. Please provide date, start, start_at, and end.' });
            return;
        }

        request.body.date = new Date(request.body.date);
        request.body.date.setHours(0, 0, 0, 0);
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
            response.status(400).json({ error: 'Start time must be before end time.' });
            return;
        }
        if (request.body.start_at >= request.body.end) {
            response.status(400).json({ error: 'Guard start time must be before end time.' });
            return;
        }
        if (request.body.start > request.body.start_at) {
            response.status(400).json({ error: 'The guard start time must be between start and end time.' });
            return;
        }

        const newOpeningRequest = new OpeningRequest(request.body);
        await newOpeningRequest.save();
        response.status(201).json({ message: 'Day created successfully.', day: newOpeningRequest });

    } catch (err) {
        response.status(500).json({ message: 'Server error', details: err });
        console.error("Error creating day:", err);
    }
});



export default router;
