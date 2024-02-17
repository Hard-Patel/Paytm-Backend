import { Request, Response } from "express";
import {
  addUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../validators/user-validator";
import { comparePassword, hashPassword } from "../utils/global.utils";
import { prisma } from "../database/db-provider";
import {
  createUserRequestProps,
  loginUserProps,
} from "../interfaces/user-interface";
import { ErrorMessages } from "../utils/constants";
const jwt = require("jsonwebtoken");

const getUsers = async (filter: string, size: string, skipper: number) => {
  try {
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: filter.toString(), mode: "insensitive" } },
          { firstName: { contains: filter.toString(), mode: "insensitive" } },
          { lastName: { contains: filter.toString(), mode: "insensitive" } },
        ],
      },
      take: +size,
      skip: skipper,
    });
  } catch (e) {
    console.log("e: ", e);
    throw new Error((e as Error)?.message);
  }
};

const validateAndCreateUser = async (props: createUserRequestProps) => {
  try {
    const { username, email, password, first_name, last_name } = props;
    const hashPass = await hashPassword(password);
    const randomBalance = Math.floor(Math.random() * 1000);
    const userExist = await prisma.user.findMany({
      where: {
        OR: [
          { email: { equals: email, mode: "insensitive" } },
          {
            username: {
              equals: username,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    if (userExist?.length) {
      throw new Error(ErrorMessages.userAlreadyExists);
    }
    return await prisma.user.create({
      data: {
        email: email,
        firstName: first_name,
        lastName: last_name,
        password: hashPass,
        username: username,
        Account: {
          create: {
            balance: randomBalance,
          },
        },
      },
    });
  } catch (e) {
    console.log("e: ", e);
    throw new Error((e as Error).message);
  }
};

const validateAndLoginUser = async ({ username, password }: loginUserProps) => {
  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: username,
      },
      include: {
        Account: {
          select: {
            balance: true,
          },
        },
      },
    });

    const isAuthenticated = await comparePassword(
      password,
      foundUser?.password ?? ""
    );

    if (isAuthenticated) {
      const { id, email, username, firstName, lastName } = foundUser ?? {};
      const jwtSecret = process.env.JWT_SECRET_KEY;
      const expiresIn = process.env.JWT_Expiry;
      const token = jwt.sign({ email, id }, jwtSecret, { expiresIn });
      return { ...{ id, email, username, firstName, lastName }, token };
    } else {
      throw new Error(ErrorMessages.insufficientBalance);
    }
  } catch (e) {
    throw new Error((e as Error)?.message);
  }
};

const updateUserModel = async (filteredUser: any, email: string) => {
  try {
    return await prisma.user.update({
      data: {
        ...filteredUser,
      },
      where: {
        email: email,
      },
    });
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteUserModel = async (id: number) => {
  try {
    return await prisma.user.delete({
      where: {
        id: id,
      },
      include: {
        Account: true,
      },
    });
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export {
  updateUserModel,
  getUsers,
  deleteUserModel,
  validateAndCreateUser,
  validateAndLoginUser,
};
