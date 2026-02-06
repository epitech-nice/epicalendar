import { Router } from "express";
import { authenticateToken, authorizeAdmin } from "@/middlewares/auth.middleware";
import { AccountsController } from "@/controllers/accounts.controller";

const router = Router();

// GET routes
router.get(
    "/accounts",
    authenticateToken,
    authorizeAdmin,
    AccountsController.getAllAccounts,
);
router.get(
    "/accounts/aer",
    AccountsController.getAerAccounts
);
router.get(
    "/accounts/:id",
    authenticateToken,
    authorizeAdmin,
    AccountsController.getAccountById,
);

// POST routes
router.post(
    "/accounts",
    authenticateToken,
    authorizeAdmin,
    AccountsController.createAccount,
);

// PUT routes
router.put(
    "/accounts/:id",
    authenticateToken,
    authorizeAdmin,
    AccountsController.updateAccount,
);

// DELETE routes
router.delete(
    "/accounts/:id",
    authenticateToken,
    authorizeAdmin,
    AccountsController.deleteAccount,
);

export default router;
