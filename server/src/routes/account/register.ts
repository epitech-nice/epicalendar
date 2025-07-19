import { Request, Response, Router } from "express";
import {Account, formatAccountFields} from "../../models/account";



const router = Router();



router.post('/register', async (request: Request, response: Response): Promise<void> => {
    //console.log(request);
    try {
        let { email, first_name, last_name, password } = request.body;
        if (!email || !first_name || !last_name || !password) {
            response.status(400).json({ message: 'Fields are missing. Please provide email, first name, last name, and password.' });
            return;
        }

        const existing = await Account.findOne({ $or: [{ email }] });
        if (existing) {
            response.status(409).json({ message: 'Email already exists.' });
            return;
        }

        const formattedFields = await formatAccountFields(first_name, last_name, password);
        const account = new Account({
            email,
            first_name: formattedFields.first_name,
            last_name: formattedFields.last_name,
            password: formattedFields.password,
        });
        await account.save();
        response.status(201).json({
            message: 'Account created successfully.',
            user: {
                email: account.email,
                first_name: account.first_name,
                last_name: account.last_name,
                role: account.role,
                photo: account.photo,
            },
        });

    } catch (error) {
        response.status(500).json({ message: 'Server error.', details: error });
        console.log(error);
    }
});

export default router;
