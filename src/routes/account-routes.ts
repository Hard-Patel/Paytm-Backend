import express from "express";
import { Routes } from "../utils/constants";
import { authentication } from "../middlewares/authMiddleware";
import { accountBalanceController, fundTransferController } from "../controllers/account-controller";

const router = express.Router();

router.get(Routes.checkAccountBalance, [authentication], accountBalanceController);

router.post(Routes.transferFunds, [authentication], fundTransferController);

export { router as accountRouter };
