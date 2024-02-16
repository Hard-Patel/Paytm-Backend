import { Request, Response } from "express";
import { prisma } from "../database/db-provider";
import { transferFundsSchema } from "../validators/account-validator";
import { transfer } from "../helpers/account-helper";
import { transferAmount } from "../interfaces/account-interface";
import { ErrorMessages } from "../utils/constants";

const getAccountBalance = async (req: Request, res: Response) => {
  let { user } = req.body;

  const getBalance = await prisma.account.findUnique({
    where: { account_id: user.id },
  });

  return res.json({
    msg: "User account balance fetched successfully",
    data: { balance: getBalance?.balance ?? 0 },
  });
};

const transferFunds = async (req: Request, res: Response) => {
  const { to, fund, user } = req.body;
  const parsed = transferFundsSchema.safeParse({ fund, to });
  if (!parsed.success) {
    return res
      .status(400)
      .json({ msg: "Invalid request", error: parsed.error });
  }
  try {
    const response: transferAmount = await transfer(user.id, to, fund);

    return res.json({
      msg: "Amount transferred successfully",
      data: { balance: response.sender.balance },
      status: true,
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message == ErrorMessages.insufficientBalance) {
        return res.status(417).send({ msg: ErrorMessages.insufficientBalance });
      }
    }
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

export { getAccountBalance, transferFunds };
