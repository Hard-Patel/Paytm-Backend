import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/db-provider";

const jwt = require("jsonwebtoken");

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecret);

    const foundUser = await prisma.user.findUnique({
        where: {
            email: decoded.email
        }
    })
    req.body.user = foundUser
    next();
    
  } catch (err) {
    return res.status(403).json({msg: "Invalid authentication token"});
  }
};
