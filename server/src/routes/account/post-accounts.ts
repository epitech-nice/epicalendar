import { Request, Response, Router } from "express";
import {Account, formatAccountFields} from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';



const router = Router();



router.post('/accounts', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        let { email, first_name, last_name, password, role, description, photo, day, room } = request.body;
        if (!email || !first_name || !last_name || !password) {
            response.status(400).json({ error: 'Fields are missing. Please provide email, first name, last name, password, and role.' });
            return;
        }

        const existingAccount = await Account.findOne({ email });
        if (existingAccount) {
            response.status(409).json({ error: 'Email already in use.' });
            return;
        }

        const formattedFields = await formatAccountFields(first_name, last_name, password);
        const newAccount = new Account({
            email,
            first_name: formattedFields.first_name,
            last_name: formattedFields.last_name,
            password: formattedFields.password,
            role,
            description: description || '',
            photo: photo || '/default-user.jpg',
            day: day || '',
            room: room || ''
        });
        await newAccount.save();
        response.status(201).json({ message: 'Account created successfully.', account: newAccount });

    } catch (err) {
        response.status(500).json({ message: 'Server error', details: err });
        console.error("Error creating account:", err);
    }
});



export default router;
