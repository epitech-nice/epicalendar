/* Import modules */
import dotenv from 'dotenv';
import express, { Request, Response} from 'express';
import cors from 'cors';
import path from 'path';

/* Import database */
import * as database from './config/database';

/* Import routes */

    /* Accounts routes */
import deleteAccounts from './routes/accounts/delete-accounts';
import getAccounts from './routes/accounts/get-accounts';
import postAccounts from './routes/accounts/post-accounts';
import putAccounts from './routes/accounts/put-accounts';

    /* Auth routes */
import getUser from "./routes/auth/get-user";
import login from './routes/auth/login';
import register from './routes/auth/register';

    /* Days routes */
import deleteDays from './routes/days/delete-days';
import getDays from './routes/days/get-days';
import postDays from './routes/days/post-days';
import putDays from './routes/days/put-days';

    /* Images routes */
import postImage from './routes/images/post-image';
import getImages from './routes/images/get-images';

    /* Opening requests routes */
import deleteOpeningRequests from './routes/opening-requests/delete-opening-requests';
import getOpeningRequests from './routes/opening-requests/get-opening-requests';
import postOpeningRequests from './routes/opening-requests/post-opening-requests';
import putOpeningRequests from './routes/opening-requests/put-opening-requests';

  /* Profile routes */
import getMe from './routes/profile/get-me';
import putMe from './routes/profile/put-me';



/* Set up app */
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



/* Default route */
app.get('/', (request: Request, response: Response) => {
    response.send('Server is running.');
});

/* Set up routes */

  /* Account routes */
app.use('/api', deleteAccounts);
app.use('/api', getAccounts);
app.use('/api', postAccounts);
app.use('/api', putAccounts);

    /* Auth routes */
app.use('/api', getUser);
app.use('/api', login);
app.use('/api', register);

    /* Days routes */
app.use('/api', deleteDays);
app.use('/api', getDays);
app.use('/api', postDays);
app.use('/api', putDays);

  /* Images routes */
app.use('/api', getImages);
app.use('/api', postImage);

    /* Opening requests routes */
app.use('/api', deleteOpeningRequests);
app.use('/api', getOpeningRequests);
app.use('/api', postOpeningRequests);
app.use('/api', putOpeningRequests);

    /* Profile routes */
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
