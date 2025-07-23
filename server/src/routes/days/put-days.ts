import { Request, Response, Router } from "express";
import { AuthenticatedRequest, authenticateToken } from "../../middleware/auth";
import {Day} from "../../models/day";



const router = Router();


//TODO: faut que sa mette à jour le compte des heures des aer
router.put('/days/:id', authenticateToken, async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;

        const existingDay = await Day.findById(id);
        if (!existingDay) {
            response.status(404).json({ message: 'Day not found.' });
            return;
        }

        if (request.body.start) {
            const orignalStart = new Date(request.body.start);
            request.body.start = new Date(existingDay.date);
            request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
        }

        if (request.body.start_at) {
            const orignalStartAt = new Date(request.body.start);
            request.body.start_at = new Date(existingDay.date);
            request.body.start_at.setHours(orignalStartAt.getHours(), orignalStartAt.getMinutes(), 0, 0);
        }

        if (request.body.end) {
            const orignalEnd = new Date(request.body.end);
            request.body.end = new Date(existingDay.date);
            request.body.end.setHours(orignalEnd.getHours(), orignalEnd.getMinutes(), 0, 0);
        }

        if (request.body.date) {
            request.body.date = new Date(request.body.date);
            request.body.date.setHours(0, 0, 0, 0);
            const existingDate = await Day.findOne({ date: request.body.date });
            if (existingDate) {
                response.status(409).json({ message: 'A day already exists for this date.' });
                return;
            }

            const orignalStart = request.body.start ? new Date(request.body.start) : existingDay.start;
            request.body.start = new Date(request.body.date);
            request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
            const orignalStartAt = request.body.start_at ? new Date(request.body.start) : existingDay.start_at;
            request.body.start_at = new Date(request.body.date);
            request.body.start_at.setHours(orignalStartAt.getHours(), orignalStartAt.getMinutes(), 0, 0);
            const orignalEnd = request.body.end ? new Date(request.body.end) : existingDay.end;
            request.body.end = new Date(request.body.date);
            request.body.end.setHours(orignalEnd.getHours(), orignalEnd.getMinutes(), 0, 0);
        }

        const updatedDay = await Day.findByIdAndUpdate(
            id,
            request.body,
            { new: true, runValidators: true }
        );

        response.status(200).json({
            message: 'Day updated successfully.',
            account: updatedDay
        });

    } catch (error) {
        response.status(500).json({ message: `Server error: ${error}` });
        console.error(error);
    }
});



export default router;
