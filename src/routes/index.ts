import express from "express";
import { Routes } from "../utils/constants";
import { accountController } from "../controllers/account-controller";
import { userRouter } from "./user-routes";

const router = express.Router();

router.use(Routes.usersRoute, userRouter);
router.use(Routes.accountRoutes, accountController);

export { router as v1Controller };
