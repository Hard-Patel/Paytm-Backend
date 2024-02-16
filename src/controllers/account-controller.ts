import express from "express";
import { Routes } from "../utils/constants";
import { authentication } from "../middlewares/authMiddleware";
import { getAccountBalance, transferFunds } from "../models/account-model";

const router = express.Router();

router.get(Routes.checkAccountBalance, [authentication], getAccountBalance);

router.post(Routes.transferFunds, [authentication], transferFunds);

export { router as accountController };
