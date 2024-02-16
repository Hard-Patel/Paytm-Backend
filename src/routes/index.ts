import express from "express";
import { usersController } from "../controllers/users-controllers";
import { Routes } from "../utils/constants";
import { accountController } from "../controllers/account-controller";

const router = express.Router();

router.use(Routes.usersRoute, usersController);
router.use(Routes.accountRoutes, accountController);

export { router as v1Controller };
