import { Request, Response } from "express";
import {
  deleteUserModel,
  getUsers,
  updateUserModel,
  validateAndCreateUser,
  validateAndLoginUser,
} from "../models/user-model";
import {
  addUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../validators/user-validator";
import { createUserRequestProps } from "../interfaces/user-interface";
import { ErrorMessages } from "../utils/constants";
import { hashPassword } from "../utils/global.utils";

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    let { filter = "", page = 1, size = 5 } = req.query;

    let skipper = +size * (+page > 0 ? +page - 1 : 0);
    skipper = skipper > 0 ? skipper : 0;
    let foundUsers = await getUsers(
      filter.toString(),
      size.toString(),
      skipper
    );
    foundUsers = foundUsers.filter((u) => u.id !== user.id);

    return res.json({
      msg: "User fetched successfully",
      data: foundUsers,
      status: true,
    });
  } catch (e) {
    console.log("e: ", e);
    return res.status(500).json({
      msg: "Something went wrong",
      status: false,
    });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
    }: createUserRequestProps = req.body;
    const parsed = addUserSchema.safeParse({
      username,
      email,
      password,
      first_name,
      last_name,
    });

    if (!parsed.success) {
      return res.json({
        msg: "Invalid input values",
        error: parsed.error,
        status: false,
      });
    }

    const createdUser = await validateAndCreateUser({
      email: email,
      first_name,
      last_name,
      password,
      username,
    });

    console.log("createdUser: ", createdUser);

    return res.send({
      msg: "User created successfully",
      data: createdUser,
      status: true,
    });
  } catch (e) {
    if ((e as Error).message == ErrorMessages.userAlreadyExists) {
      return res.status(417).send({
        msg: "User already exist with this email or username",
        status: false,
      });
    }
    return res.status(500).send({ msg: "Something went wrong", status: false });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const parsed = loginUserSchema.safeParse({
      username,
      password,
    });

    if (!parsed.success) {
      return res.status(400).json({
        msg: "Invalid credentials",
        error: parsed.error,
        status: false,
      });
    }

    const loggedInUser = await validateAndLoginUser({ username, password });
    return res.json({
      msg: "User logged in successfully",
      data: loggedInUser,
      status: true,
    });
  } catch (e) {
    if (((e as Error).message = ErrorMessages.insufficientBalance)) {
      return res.status(400).send({
        msg: "Invalid credentials or user does not exists",
        status: false,
      });
    }

    return res.status(500).send({
      msg: "Something went wrong",
      status: false,
    });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      user: { id, password: dbPassword, ...rest },
    } = req.body;
    const parsed = updateUserSchema.safeParse({
      username,
      password,
      first_name,
      last_name,
    });

    if (!parsed.success) {
      return res.json({ msg: "Invalid input values", error: parsed.error, status: false });
    }

    const userFieldsUpdate: {
      username?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
    } = {
      username,
      firstName: first_name,
      lastName: last_name,
    };
    if (password && password.length) {
      const hashPass = await hashPassword(password);
      userFieldsUpdate["password"] = hashPass;
    }

    const filteredUser = {
      ...rest,
      ...Object.fromEntries(
        Object.entries(userFieldsUpdate).filter(
          ([key, value]) => value !== undefined && value !== null
        )
      ),
    };

    const updatedUser = await updateUserModel(filteredUser, rest.email);

    return res.json({
      msg: "User updated successfully",
      data: { ...updatedUser },
      status: true,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong",
      status: false,
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const deletedUser = await deleteUserModel(user.id);

    return res.json({
      msg: "User deleted successfully",
      data: { ...deletedUser },
      status: true,
    });
  } catch (e) {
    console.log('e: ', e);
    return res.status(500).json({
      msg: "Something went wrong",
      status: false,
    });
  }
};
