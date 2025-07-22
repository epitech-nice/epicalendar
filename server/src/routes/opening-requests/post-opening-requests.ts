import { Request, Response, Router } from "express";
import { AuthenticatedRequest, authenticateToken } from "../../middleware/auth";
import {OpeningRequest} from "../../models/opening-request";



const router = Router();



router.post('/opening-requests', authenticateToken, async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
        if (!request.body.date && !request.body.start && !request.body.end && !request.body.message) {
            response.status(400).json({ error: 'Fields are missing. Please provide date, start, end, and message.' });
            return;
        }

        request.body.date = new Date(request.body.date);
        request.body.date.setHours(0, 0, 0, 0);
        const orignalStart = new Date(request.body.start);
        request.body.start = new Date(request.body.date);
        request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
        const orignalEnd = new Date(request.body.end);
        request.body.end = new Date(request.body.date);
        request.body.end.setHours(orignalEnd.getHours(), orignalEnd.getMinutes(), 0, 0);

        if (request.body.start >= request.body.end) {
            response.status(400).json({ error: 'Start time must be before end time.' });
            return;
        }

        request.body.account = request.user._id;
        if (request.body.status)
            delete request.body.status;

        const newOpeningRequest = new OpeningRequest(request.body);
        await newOpeningRequest.save();
        response.status(201).json({ message: 'Opening request created successfully.', opening_request: newOpeningRequest });

    } catch (err) {
        response.status(500).json({ message: 'Server error', details: err });
        console.error("Error creating opening request:", err);
    }
});



export default router;
