/* Import modules */
import dotenv from 'dotenv';
import express, { Request, Response} from 'express';
import cors from 'cors';

/* Import database */
import * as database from './config/database';

/* Import routes */

  /* Account routes */
import register from './routes/account/register';
import login from './routes/account/login';
import deleteAccounts from './routes/account/delete-accounts';
import getAccounts from './routes/account/get-accounts';
import postAccounts from './routes/account/post-accounts';
import putAccounts from './routes/account/put-accounts';
import getMe from './routes/account/get-me';
import putMe from './routes/account/put-me';



/* Set up app */
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

/* Default route */
app.get('/', (request: Request, response: Response) => {
  response.send('Server is running.');
});

/* Set up routes */

  /* Account routes */
app.use('/api', register);
app.use('/api', login);
app.use('/api', deleteAccounts);
app.use('/api', getAccounts);
app.use('/api', postAccounts);
app.use('/api', putAccounts);
app.use('/api', getMe);
app.use('/api', putMe);

/* Set not found handler */
app.use((request: Request, response: Response) => {
  response.status(404).json({ error: "Not found." });
});



/* Start the server */
database.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}/api`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to database:", err);
});
