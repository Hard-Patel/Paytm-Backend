import express from "express";
import { Routes } from "../utils/constants";
import { userRouter } from "./user-routes";
import { accountRouter } from "./account-routes";

const router = express.Router();

router.use(Routes.usersRoute, userRouter);
router.use(Routes.accountRoutes, accountRouter);

export { router as v1Controller };
