import { Request, Response, Router } from "express";
import {Account, generateToken} from "../../models/account";
import bcrypt from "bcrypt";



const router = Router();

router.post('/login', async (request: Request, response: Response): Promise<void> => {
    console.log(request);
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      response.status(400).json({ message: 'Fields are missing. Please provide email and password.' });
      return;
    }

    const user = await Account.findOne({ email });
    if (!user) {
      response.status(401).json({ message: 'Invalid email or password.' });
      console.log('Login attempt with non-existent email:', email);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      response.status(401).json({ message: 'Invalid email or password.' });
      console.log('Login attempt with incorrect password for email:', email);
      return;
    }

    response.json({
      message: 'Login successful.',
      token: generateToken(user._id, user.role),
      user,
    });
  } catch (err) {
    response.status(500).json({ message: 'Server error.', details: err });
    console.log(err);
  }
});

export default router;
