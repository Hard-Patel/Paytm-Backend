import express from "express";
import { Routes } from "../utils/constants";
import { authentication } from "../middlewares/authMiddleware";
import {
  createUserController,
  deleteUserController,
  getUserController,
  loginUserController,
  updateUserController,
} from "../controllers/users-controllers";

const router = express.Router();

router.get(Routes.getUserRoute, [authentication], getUserController);
router.post(Routes.addUserRoute, createUserController);
router.post(Routes.loginUserRoute, loginUserController);
router.patch(Routes.updateUserRoute, [authentication], updateUserController);
router.delete(Routes.deleteUserRoute, [authentication], deleteUserController);

export { router as userRouter };
