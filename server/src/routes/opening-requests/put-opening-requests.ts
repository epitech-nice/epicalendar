import { Request, Response, Router } from "express";
import { AuthenticatedRequest, authenticateToken } from "../../middleware/auth";
import {OpeningRequest} from "../../models/opening-request";



const router = Router();



router.put('/opening-request/:id', authenticateToken, async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
        const { id } = request.params;

        const existingOpeningRequest = await OpeningRequest.findById(id);
        if (!existingOpeningRequest) {
            response.status(404).json({ error: 'Opening request not found.' });
            return;
        }

        if (request.body.start) {
            const orignalStart = new Date(request.body.start);
            request.body.start = new Date(existingOpeningRequest.date);
            request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
        }

        if (request.body.end) {
            const orignalEnd = new Date(request.body.end);
            request.body.end = new Date(existingOpeningRequest.date);
            request.body.end.setHours(orignalEnd.getHours(), orignalEnd.getMinutes(), 0, 0);
        }

        if (request.body.date) {
            request.body.date = new Date(request.body.date);
            request.body.date.setHours(0, 0, 0, 0);
            const orignalStart = request.body.start ? new Date(request.body.start) : existingOpeningRequest.start;
            request.body.start = new Date(request.body.date);
            request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
            const orignalEnd = request.body.end ? new Date(request.body.end) : existingOpeningRequest.end;
            request.body.end = new Date(request.body.date);
            request.body.end.setHours(orignalEnd.getHours(), orignalEnd.getMinutes(), 0, 0);
        }

        if (request.body.created_at)
            delete request.body.created_at;
        if (request.body.account)
            delete request.body.account;

        const updatedOpeningRequest = await OpeningRequest.findByIdAndUpdate(
            id,
            request.body,
            { new: true, runValidators: true }
        );

        response.status(200).json({
            message: 'Opening request updated successfully.',
            opening_request: updatedOpeningRequest
        });

    } catch (error) {
        response.status(500).json({ message: 'Server error.', details: error });
        console.error(error);
    }
});



export default router;
