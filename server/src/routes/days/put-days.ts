import { Request, Response, Router } from "express";
import { AuthenticatedRequest, authenticateToken } from "../../middleware/auth";
import {Day} from "../../models/day";



const router = Router();



router.put('/days/:id', authenticateToken, async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;

        const existingDay = await Day.findById(id);
        if (!existingDay) {
            response.status(404).json({ message: 'Day not found.' });
            return;
        }

        if (request.body.open) {
            const orignalOpen = new Date(request.body.open);
            request.body.open = new Date(existingDay.date);
            request.body.open.setHours(orignalOpen.getHours(), orignalOpen.getMinutes(), 0, 0);
        }

        if (request.body.start) {
            const orignalStart = new Date(request.body.start);
            request.body.start = new Date(existingDay.date);
            request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
        }

        if (request.body.close) {
            const orignalClose = new Date(request.body.close);
            request.body.close = new Date(existingDay.date);
            request.body.close.setHours(orignalClose.getHours(), orignalClose.getMinutes(), 0, 0);
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

            const orignalOpen = request.body.open ? new Date(request.body.open) : existingDay.open;
            request.body.open = new Date(request.body.date);
            request.body.open.setHours(orignalOpen.getHours(), orignalOpen.getMinutes(), 0, 0);
            const orignalStart = request.body.start ? new Date(request.body.start) : existingDay.start;
            request.body.start = new Date(request.body.date);
            request.body.start.setHours(orignalStart.getHours(), orignalStart.getMinutes(), 0, 0);
            const orignalClose = request.body.close ? new Date(request.body.close) : existingDay.close;
            request.body.close = new Date(request.body.date);
            request.body.close.setHours(orignalClose.getHours(), orignalClose.getMinutes(), 0, 0);
            const orignalEnd = request.body.end ? new Date(request.body.end) : existingDay.end;
            if (orignalEnd) {
                request.body.end = new Date(request.body.date);
                request.body.end.setHours(orignalEnd.getHours(), orignalEnd.getMinutes(), 0, 0);
            }
        }

        if ((request.body.open && request.body.close && request.body.open >= request.body.close) ||
        (request.body.open && !request.body.close && request.body.open >= existingDay.close) ||
        (!request.body.open && request.body.close && existingDay.open >= request.body.close)) {
            response.status(400).json({ message: 'Open time must be before close time.' });
            return;
        }
        if ((request.body.start && request.body.close && request.body.start >= request.body.close) ||
        (request.body.start && !request.body.close && request.body.start >= existingDay.close) ||
        (!request.body.start && request.body.close && existingDay.start >= request.body.close)) {
            response.status(400).json({ message: 'Guard start time must be before close time.' });
            return;
        }
        if ((request.body.open && request.body.start && request.body.open > request.body.start) ||
        (request.body.open && !request.body.start && request.body.open > existingDay.start) ||
        (!request.body.open && request.body.start && existingDay.open > request.body.start)) {
            response.status(400).json({ message: 'The guard start time must be between open and close time.' });
            return;
        }
        if ((request.body.end && request.body.start && request.body.end < request.body.start) ||
        (request.body.end && !request.body.start && request.body.end < existingDay.start)) {
            response.status(400).json({ message: 'The guard end time must be after the guard start time.' });
            return;
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
