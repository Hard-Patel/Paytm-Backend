import { Request, Response } from "express";
import {
  addUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../validators/user-validator";
import { comparePassword, hashPassword } from "../utils/global.utils";
import { prisma } from "../database/db-provider";
const jwt = require("jsonwebtoken");

async function createUser(req: Request, res: Response) {
  try {
    const { username, email, password, first_name, last_name } = req.body;
    const parsed = addUserSchema.safeParse({
      username,
      email,
      password,
      first_name,
      last_name,
    });

    if (!parsed.success) {
      return res.json({ msg: "Invalid input values", error: parsed.error });
    }

    const hashPass = await hashPassword(password);
    const randomBalance = Math.floor(Math.random() * 1000)
    const createdUser = await prisma.user.create({
      data: {
        email: email,
        firstName: first_name,
        lastName: last_name,
        password: hashPass,
        username: username,
        Account: {
          create: {
            balance: randomBalance,
          }
        }
      },
    });

    return res.send({ msg: "User created successfully", data: createdUser });
  } catch (e) {
    return res.status(500).send({ msg: "Something went wrong" });
  }
}

async function loginUser(req: Request, res: Response) {
  const { username, password } = req.body;
  const parsed = loginUserSchema.safeParse({
    username,
    password,
  });

  if (!parsed.success) {
    return res.json({ msg: "Invalid credentials", error: parsed.error });
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      email: username,
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
    return res.send({
      msg: "User logged-in successfully",
      data: { ...foundUser, token },
    });
  }
  return res.send({ msg: "Invalid credentials or user does not exists" });
}

const updateUser = async (req: Request, res: Response) => {
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
    return res.json({ msg: "Invalid input values", error: parsed.error });
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

  const updatedUser = await prisma.user.update({
    data: {
      ...filteredUser,
    },
    where: {
      email: rest.email,
    },
  });

  return res.json({
    msg: "User updated successfully",
    data: { ...updatedUser },
  });
};

const getUsers = async (req: Request, res: Response) => {
  let { filter = "", page = 1, size = 5 } = req.query;
  let skipper = +size * (+page > 0 ? +page - 1 : 0)
  skipper = skipper > 0 ? skipper : 0;
  const getUsers = await prisma.user.findMany({
    where: { username: { contains: filter.toString(), mode: 'insensitive' } },
    take: +size,
    skip: skipper,
  });

  return res.json({
    msg: "User fetched successfully",
    data: getUsers,
  });
};

export { createUser, loginUser, updateUser, getUsers };
