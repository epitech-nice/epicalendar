import { Router } from "express";

/**
 * Main router that aggregates all application routes
 */
const router = Router();

/* Account routes */
import account from "./accouts.route";
router.use(account);

/* Auth routes */
import auth from "./auth.route";
router.use(auth);

/* Days routes */
import days from "./days.route";
router.use(days);

/* Images routes */
import images from "./image.route";
router.use(images);

/* Opening requests routes */
import openingRequests from "./opening-requests.route";
router.use(openingRequests);

/* Profile routes */
import profile from "./profile.route";
router.use(profile);

export default router;
