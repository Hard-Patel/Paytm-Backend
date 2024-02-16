import express from "express";
import { createUser, getUsers, loginUser, updateUser } from "../models/user-model";
import { Routes } from "../utils/constants";
import { loginUserSchema } from "../validators/user-validator";
import { authentication } from "../middlewares/authMiddleware";
// import { authentication } from "../middlewares/authentication";

const router = express.Router();

router.get(Routes.getUserRoute, getUsers);
router.post(Routes.addUserRoute, createUser);
router.post(Routes.loginUserRoute, loginUser);
router.patch(Routes.updateUserRoute, [authentication], updateUser);
// router.delete("/delete-user", [authentication], deleteUser);

export { router as usersController };
